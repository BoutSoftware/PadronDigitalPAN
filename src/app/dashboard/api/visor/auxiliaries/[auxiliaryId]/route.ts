import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { hasIncompleteFields } from "@/utils";
import { select } from "@nextui-org/react";

export async function PATCH(request: NextRequest, { params }: { params: { auxiliaryId: string } }) {
  try {
    const reqBody = await request.json();
    const { structureId, subCoordinatorId, municipios, technicalId } = reqBody;
    const auxiliaryId = params.auxiliaryId;

    if (hasIncompleteFields({ subCoordinatorId, municipios, technicalId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    // Verify if coordinator exists
    const currentAuxiliary = await prisma.visor_Auxiliaries.findFirst({ where: { id: auxiliaryId, active: true } });

    if (!currentAuxiliary) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Auxiliary not found" });
    }

    // Update coordination info of structure and titles of the users
    const updateResult = await prisma.visor_Auxiliaries.update({
      where: { id: auxiliaryId },
      data: {
        Technical: {
          connect: {
            id: technicalId,
          },
          update: {
            title: "Tecnico de Auxiliar"
          },
        },
      }
    });

    // Verify if the previous tech should be updated
    if (currentAuxiliary.technicalId !== technicalId)
      await prisma.visor_User.update({ where: { id: currentAuxiliary.technicalId }, data: { title: null } });

    return NextResponse.json({ code: "OK", message: "Auxiliary updated successfully", data: updateResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export async function GET(request: NextRequest, { params }: { params: { auxiliaryId: string } }) {
  const auxiliaryId = params.auxiliaryId;

  try {
    const currentAuxiliary = await prisma.visor_Auxiliaries.findFirst({
      where: { id: auxiliaryId, active: true },
      include: {
        SubCoordinator: { select: { structureId: true, pointTypesIDs: true } },
        Technical: { select: { fullname: true, id: true } },
        User: { select: { fullname: true } }
      }
    });

    if (!currentAuxiliary) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Auxiliary not found" });
    }

    const data = {
      ...currentAuxiliary,
      structureId: currentAuxiliary?.SubCoordinator.structureId,
      SubCoordinator: undefined,
      technical: currentAuxiliary?.Technical,
      fullName: currentAuxiliary?.User.fullname,
      pointTypeIDs: currentAuxiliary?.SubCoordinator.pointTypesIDs
    };

    return NextResponse.json({ code: "OK", message: "Auxiliary retrieved successfully", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

// Delete auxiliary by id
export async function DELETE(request: NextRequest, { params }: { params: { auxiliaryId: string } }) {
  const auxiliaryId = params.auxiliaryId;

  try {
    const currentAuxiliary = await prisma.visor_Auxiliaries.findFirst({
      where: { id: auxiliaryId, active: true },
      include: {
        Teams: {
          where: {
            active: true
          }
        }
      }
    });

    if (!currentAuxiliary) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Auxiliary not found" });
    }

    // Get base url
    const baseUrl = request.nextUrl.origin;

    // Delete teams (update active status and user titles)
    if (currentAuxiliary.Teams && currentAuxiliary.Teams.length > 0) {
      await Promise.all(currentAuxiliary.Teams.map(async team => {
        try {
          const teamUrl = new URL(`/dashboard/api/visor/teams/${team.id}`, baseUrl).href;

          const result = await fetch(teamUrl, { method: "DELETE" }).then(res => res.json());
          if (result.code === "ERROR") {
            return NextResponse.json({ code: "ERROR", message: `An error occurred while deleting team: ${team.name}` });
          }
        } catch (error) {
          console.log(error);
          return NextResponse.json({ code: "ERROR", message: "An error occurred while deleting teams" });
        }
      }));
    }

    // Update auxiliary active status and user titles
    const deleteResult = await prisma.visor_Auxiliaries.update({
      where: { id: auxiliaryId },
      data: {
        active: false,
        Technical: {
          update: {
            title: null
          }
        },
        User: {
          update: {
            title: null
          }
        },
      }
    });

    return NextResponse.json({ code: "OK", message: "Auxiliary deleted successfully", data: deleteResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
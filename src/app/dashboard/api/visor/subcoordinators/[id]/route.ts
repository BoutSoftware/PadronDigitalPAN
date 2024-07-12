import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

// Update subcoordinator
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  interface reqBody {
    category: string;
    userId: string;
    technicalId: string;
    pointTypesIDs: string[];
    structureId: string;
  }

  try {
    const reqBody = await request.json() as reqBody;
    const { category, userId, technicalId, pointTypesIDs, structureId } = reqBody;
    const id = params.id;

    if (hasIncompleteFields({ category, userId, technicalId, pointTypesIDs, structureId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    // Verify if subcoordinator exists
    const subcoordinatorExists = await prisma.visor_SubCoordinator.findFirst({ where: { id } });

    if (!subcoordinatorExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Subcoordinator not found" });
    }

    const subcoordinator = await prisma.visor_SubCoordinator.update({
      where: { id },
      data: {
        userId,
        technicalId,
        pointTypesIDs,
        structureId
      }
    });

    return NextResponse.json({ code: "OK", message: "Subcoordinator updated", data: subcoordinator });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

// Delete subcoordinator by id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get base url
    const baseUrl = request.nextUrl.origin;
    const id = params.id;
    
    const currentSubcoordinator = await prisma.visor_SubCoordinator.findUnique({
      where: { id, active: true },
      include: {
        Auxiliaries: {
          where: { active: true }
        }
      }
    });

    if (!currentSubcoordinator) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Subcoordinator not found" });
    }

    // Delete auxiliares, teams and relationships
    if (currentSubcoordinator.Auxiliaries && currentSubcoordinator.Auxiliaries.length > 0) {
      await Promise.all(currentSubcoordinator.Auxiliaries.map(async auxiliary => {
        try {
          const teamUrl = new URL(`/dashboard/api/visor/auxiliaries/${auxiliary.id}`, baseUrl).href;

          const result = await fetch(teamUrl, { method: "DELETE" }).then(res => res.json());
          if (result.code === "ERROR") {
            return NextResponse.json({ code: "ERROR", message: `An error occurred while deleting auxiliary: ${auxiliary.id}` });
          }
        } catch (error) {
          console.log(error);
          return NextResponse.json({ code: "ERROR", message: "An error occurred while deleting auxiliaries" });
        }
      }));
    }

    // Update subcoordinator active status and user titles
    const deletedResult = await prisma.visor_SubCoordinator.update({
      where: { id },
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

    return NextResponse.json({ code: "OK", message: "Subcoordinator deleted successfully", data: deletedResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
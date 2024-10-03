import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Visor_User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Update subcoordinator
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  interface reqBody {
    userId: string;
    technicalId: string;
    pointTypesIDs: string[];
    structureId: string;
  }

  try {
    const reqBody = await request.json() as reqBody;
    const { userId, technicalId, pointTypesIDs, structureId } = reqBody;
    const id = params.id;

    if (hasIncompleteFields({ userId, technicalId, pointTypesIDs, structureId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    // Verify if subcoordinator exists
    const subcoordinatorExists = await prisma.visor_SubCoordinator.findFirst({
      where: { id, active: true },
      include: {
        Technical: true,
        User: true
      }
    });

    if (!subcoordinatorExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Subcoordinator not found" });
    }

    // Check if technical id is different to previous one and user id to subcoordinator and update user titles
    await prisma.visor_SubCoordinator.update({
      where: { id },
      data: {
        Technical: {
          update: {
            title: technicalId === subcoordinatorExists.technicalId ?
              subcoordinatorExists.Technical.title : null
          }
        },
        User: {
          update: {
            title: userId === subcoordinatorExists.userId ?
              subcoordinatorExists.User.title : null
          }
        }
      }
    });

    const subcoordinator = await prisma.visor_SubCoordinator.update({
      where: { id },
      data: {
        pointTypesIDs,
        structureId,
        User: {
          connect: {
            id: userId
          },
          update: {
            title: "subcoordinador"
          }
        },
        Technical: {
          connect: {
            id: technicalId
          },
          update: {
            title: "tecSubcoordinador"
          }
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "Subcoordinator updated", data: subcoordinator });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export interface resBody_getSubcoordinatorid {
  id: string,
  pointTypesIDs: string[],
  structureId: string,
  Technical: Visor_User
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const subcoordinator = await prisma.visor_SubCoordinator.findFirst({
      where: { id, active: true },
      select: {
        id: true,
        pointTypesIDs: true,
        structureId: true,
        Technical: {
          select: {
            id: true,
            fullname: true,
            title: true,
            active: true,
            rol: true,
            createdAt: true,
            userId: true
          }
        },
        User: {
          select: {
            fullname: true
          }
        }
      }
    });

    if (!subcoordinator) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Subcoordinator not found" });
    }

    const formattedData = {
      id: subcoordinator.id,
      fullName: subcoordinator.User.fullname,
      pointTypesIDs: subcoordinator.pointTypesIDs,
      structureId: subcoordinator.structureId,
      Technical: {
        id: subcoordinator.Technical.id,
        fullname: subcoordinator.Technical.fullname,
        title: subcoordinator.Technical.title,
        active: subcoordinator.Technical.active,
        createdAt: subcoordinator.Technical.createdAt,
        rol: subcoordinator.Technical.rol,
        userId: subcoordinator.Technical.userId
      }
    };

    return NextResponse.json({ code: "OK", message: "Subcoordinator retrieved successfully", data: formattedData });
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
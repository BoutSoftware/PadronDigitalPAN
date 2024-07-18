import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

// Create a subcoordinator
export async function POST(request: NextRequest) {
  interface reqBody {
    userId: string;
    technicalId: string;
    pointTypesIDs: string[];
    structureId: string;
  }

  try {
    const reqBody = await request.json() as reqBody;
    const { userId, technicalId, pointTypesIDs, structureId } = reqBody;

    if (hasIncompleteFields({ userId, technicalId, pointTypesIDs, structureId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const createResult = await prisma.visor_SubCoordinator.create({
      data: {
        pointTypesIDs,
        structureId,
        User: {
          connect: {
            id: userId
          }
        },
        Technical: {
          connect: {
            id: technicalId
          }
        }
      }
    });

    const updateResult = await prisma.visor_SubCoordinator.update({
      where: {
        id: createResult.id
      },
      data: {
        User: {
          update: {
            title: "subcoordinador"
          }
        },
        Technical: {
          update: {
            title: "tecSubcoordinador"
          }
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "Subcoordinator created", data: updateResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const estructura = (searchParams.get("estructura") as string) || undefined;

    const subCooridnadores = await prisma.visor_SubCoordinator.findMany({
      where: {
        active: true,
        structureId: estructura
      },
      include: {
        User: true
      }
    });

    if (!subCooridnadores.length) {
      return NextResponse.json({ code: "NOT_FOUND", message: "No subcoordinators found" });
    }

    const data = subCooridnadores.map((subCoor) => {
      return {
        ...subCoor,
        fullName: subCoor.User.fullname,
        User: undefined
      };
    });

    return NextResponse.json({ code: "OK", message: "Subcoordinators found", data });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });

  }
}
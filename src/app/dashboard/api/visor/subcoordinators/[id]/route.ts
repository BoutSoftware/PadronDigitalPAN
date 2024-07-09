import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Visor_User } from "@prisma/client";
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

    // Check if technical id is different to previous one
    if (technicalId === subcoordinatorExists.technicalId) {
      await prisma.visor_SubCoordinator.update({
        where: { id },
        data: {
          Technical: {
            update: {
              title: null
            },
          }
        }
      });
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
      where: { id },
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
        }
      } 
    });

    if (!subcoordinator) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Subcoordinator not found" });
    }

    const formattedData: resBody_getSubcoordinatorid = {
      id: subcoordinator.id,
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
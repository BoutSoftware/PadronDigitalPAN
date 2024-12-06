import { hasIncompleteFields } from "@/utils";
import { PrismaClient, Visor_Structure } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { structureId, coordinatorId } = await request.json();

    if (hasIncompleteFields({ structureId, coordinatorId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const createResult = await prisma.visor_structureCoordinator.create({
      data: {
        structureId: structureId,
        VisorUser: {
          connect: {
            id: coordinatorId as string
          },
        },
      }
    });

    const updateResult = await prisma.visor_structureCoordinator.update({
      where: {
        id: createResult.id
      },
      data: {
        VisorUser: {
          update: {
            title: "Coordinador de Activacion"
          }
        },
      }
    });

    return NextResponse.json({ code: "OK", message: "Structure Coordinator Created", data: updateResult });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
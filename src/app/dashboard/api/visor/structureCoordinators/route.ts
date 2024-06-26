import { hasIncompleteFields } from "@/utils";
import { PrismaClient, Visor_Structure } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { structureId, coordinatorId, technicalId, attachId } = await request.json();

    if (hasIncompleteFields({ structureId, coordinatorId, technicalId, attachId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    if (technicalId === attachId) {
      return NextResponse.json({ code: "BAD_FIELDS", message: "technicalId and auditorId cannot be the same" });
    }

    const createResult = await prisma.visor_structureCoordinator.create({
      data: {
        structureId: structureId,
        VisorUser: {
          connect: {
            id: coordinatorId as string
          },
        },
        Technical: {
          connect: {
            id: technicalId as string,
          },
        },
        Attach: {
          connect: {
            id: attachId as string,
          },
        }
      }
    });

    const updateResult = await prisma.visor_structureCoordinator.update({
      where: {
        id: createResult.id
      },
      data: {
        Attach: {
          update: {
            title: "Adjunto de Coordinador"
          }
        },
        VisorUser: {
          update: {
            title: "Coordinador de Estructura"
          }
        },
        Technical: {
          update: {
            title: "Tecnico de Coordinador"
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
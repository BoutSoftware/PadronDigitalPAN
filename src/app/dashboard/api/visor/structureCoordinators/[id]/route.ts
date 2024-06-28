import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { hasIncompleteFields } from "@/utils";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  interface reqBody {
    structureId: string;
    technicalId: string;
    attachId: string;
  }

  try {
    const reqBody = await request.json() as reqBody;
    const { structureId, technicalId, attachId } = reqBody;
    const id = params.id;

    if (hasIncompleteFields({ structureId, technicalId, attachId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    if (technicalId === attachId) {
      return NextResponse.json({ code: "BAD_FIELDS", message: "technicalId and auditorId cannot be the same" });
    }

    // Verify if coordinator exists
    const coordinatorExists = await prisma.visor_structureCoordinator.findFirst({ where: { id } });

    if (!coordinatorExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Coordinator not found" });
    }

    // Update coordination info of structure and titles of the users
    const updateResult = await prisma.visor_structureCoordinator.update({
      where: { id },
      data: {
        structureId,
        Technical: {
          connect: {
            id: technicalId,
          },
          update: {
            title: "Tecnico de Coordinador"
          }
        },
        Attach: {
          connect: {
            id: attachId,
          },
          update: {
            title: "Adjunto de Coordinador"
          }
        },
      }
    });

    return NextResponse.json({ code: "OK", message: "Coordinator updated successfully", data: updateResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

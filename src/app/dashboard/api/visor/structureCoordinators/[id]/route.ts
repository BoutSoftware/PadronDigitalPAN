import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { hasIncompleteFields } from "@/utils";

// get coordinator
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const coordinator = await prisma.visor_structureCoordinator.findFirst({
      where: { id, active: true },
      include: {
        VisorUser: true
      }
    });

    if (!coordinator) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Coordinator not found" });
    }

    return NextResponse.json({ code: "OK", message: "Coordinator retrieved successfully", data: coordinator });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  interface reqBody {
    structureId: string;
    technicalId: string;
    attachId: string;
  }

  try {
    const reqBody = await request.json() as reqBody;
    const { structureId } = reqBody;
    const id = params.id;

    if (hasIncompleteFields({ structureId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    // Verify if coordinator exists
    const coordinatorExists = await prisma.visor_structureCoordinator.findFirst({
      where: { id, active: true },
    });

    if (!coordinatorExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Coordinator not found" });
    }

    // Update coordination info of structure and titles of the users
    const updateResult = await prisma.visor_structureCoordinator.update({
      where: { id },
      data: {
        structureId,
      }
    });

    return NextResponse.json({ code: "OK", message: "Coordinator updated successfully", data: updateResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

// Change active status to false for all dependecies of a coordinator and change user titles to null
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Verify if coordinator exists
    const coordinatorExists = await prisma.visor_structureCoordinator.findFirst({
      where: { id, active: true }
    });

    if (!coordinatorExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Coordinator not found" });
    }

    // if try to "deleted" again
    if (!coordinatorExists.active) {
      return NextResponse.json({ code: "BAD_REQUEST", message: "Coordinator already deleted" });
    }

    // update coordinator status and user titles
    const updateResult = await prisma.visor_structureCoordinator.update({
      where: { id },
      data: {
        active: false,
        VisorUser: {
          update: {
            title: null
          }
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "Coordinator deleted successfully", data: updateResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

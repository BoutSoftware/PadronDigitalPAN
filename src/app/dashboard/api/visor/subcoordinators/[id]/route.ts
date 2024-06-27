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
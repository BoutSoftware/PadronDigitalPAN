import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

// Create a subcoordinator
export async function POST(request: NextRequest) {
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

    if (hasIncompleteFields({ category, userId, technicalId, pointTypesIDs, structureId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const subcoordinator = await prisma.visor_SubCoordinator.create({
      data: {
        category,
        userId,
        technicalId,
        pointTypesIDs,
        structureId
      }
    });

    // Update title of Visor_User to Subcoordinator
    await prisma.visor_User.update({
      where: { id: userId },
      data: { title: "Subcoordinador" }
    });

    // Update title of Visor_User to Technical
    await prisma.visor_User.update({
      where: { id: technicalId },
      data: { title: "Técnico de subcoordinación" }
    });

    return NextResponse.json({ code: "OK", message: "Subcoordinator created", data: subcoordinator });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
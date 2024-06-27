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

    const subcoordinator = await prisma.visor_SubCoordinator.create({
      data: {
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const estructura = searchParams.get("estructura") as string;

    if (!estructura) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const subCooridnadores = await prisma.visor_SubCoordinator.findMany({
      where: {
        structureId: estructura
      }
    });

    return NextResponse.json({ code: "OK", message: "Subcoordinators found", data: subCooridnadores });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });

  }
}
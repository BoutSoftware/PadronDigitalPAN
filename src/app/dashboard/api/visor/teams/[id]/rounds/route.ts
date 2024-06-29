import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { hasIncompleteFields } from "@/utils";
import { STATUS_RONDAS } from "@/configs/catalogs/visorCatalog";

// Create a round
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  interface reqBody {
    name: string;
    startedAt: Date | undefined;
    status: string | undefined;
    pointTypesIDs: string[];
    createdById: string;
    checkPoints: {
      latitude: number;
      longitude: number;
    }[];
  }

  try {
    const reqBody = await request.json() as reqBody;
    const { id } = params;
    const { name, startedAt, pointTypesIDs, status, createdById, checkPoints } = reqBody;

    if (hasIncompleteFields({ name, pointTypesIDs, createdById, checkPoints })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    // Verify if team exists and is active
    const teamExists = await prisma.visor_Team.findFirst({ where: { id, active: true } });

    if (!teamExists) {
      return NextResponse.json({ code: "TEAM_NOT_FOUND", message: "Team not found" });
    }

    // Verify if user exists
    const userExists = await prisma.visor_User.findFirst({ where: { id: createdById } });
    if (!userExists) {
      return NextResponse.json({ code: "USER_NOT_FOUND", message: "User not found" });
    }

    // create round and checkpoints
    const round = await prisma.visor_Round.create({
      data: {
        name,
        teamId: id,
        // If the round starts at the moment, the status that comes from the front is assigned
        status: status ? status :
        // If it is not started at the moment, the status of not started is added to the catalogs
        STATUS_RONDAS.map((status) => status.id).find((id) => id === "noiniciada")!,
        // If the round starts at the moment, the date received is set, otherwise it is set to null
        startedAt: startedAt ? startedAt : null,
        pointTypesIDs,
        createdById,
        CheckPoints: {
          createMany: {
            data: checkPoints.map((checkPoint) => ({
              latitude: checkPoint.latitude,
              longitude: checkPoint.longitude
            }))
          }
        },
      },
      include: {
        CheckPoints: true
      }
    });

    return NextResponse.json({ code: "OK", message: "Round created successfully", data: round });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
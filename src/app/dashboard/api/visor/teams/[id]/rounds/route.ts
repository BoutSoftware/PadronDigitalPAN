import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { hasIncompleteFields } from "@/utils";
import { STATUS_RONDAS } from "@/configs/catalogs/visorCatalog";



export async function GET( request: NextRequest, { params }: { params: { id: string } } ) {
  try {


    const { id } = params;

    const team = await prisma.visor_Team.findUnique({ where: { id } });

    if (!team) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Team not found" });
    }
    
    const rounds = await prisma.visor_Round.findMany({ 
      where: { 
        teamId: id,
        active: true,
        status: { 
          in: ["activa", "noiniciada", "pausada" ] as typeof STATUS_RONDAS[number]["id"][]
        }
      },
      select: {
        id: true,
        name: true,
        status: true,
        pointTypesIDs: true,
      }
    });

    if (!rounds.length) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Rounds not found" });
    }

    return NextResponse.json({ code: "OK", message: "Rounds retrieved successfully", data: rounds });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}

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
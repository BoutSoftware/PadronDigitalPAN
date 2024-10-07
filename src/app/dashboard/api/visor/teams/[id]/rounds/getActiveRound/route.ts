import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const teamExists = await prisma.visor_Team.findFirst({ where: { id, active: true } });

    if (!teamExists) {
      return NextResponse.json({ code: "TEAM_NOT_FOUND", message: "Team not found" });
    }

    const round = await prisma.visor_Round.findMany({
      where: {
        status: {
          in: ["activa", "pausada"],
        },
        teamId: id
      },
      include: {
        CheckPoints: true
      }
    });

    if (round.length === 0) {
      return NextResponse.json({ code: "ROUND_NOT_FOUND", message: "No active round found" });
    }

    if (round.length > 1) {
      return NextResponse.json({ code: "ERROR", message: "More than one active round found" });
    }

    return NextResponse.json({ code: "OK", message: "Round retrieved successfully", data: round[0] });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
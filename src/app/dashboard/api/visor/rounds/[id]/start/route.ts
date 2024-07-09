import { STATUS_RONDAS } from "@/configs/catalogs/visorCatalog";
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { teamid, action } = await request.json() as { teamid: string, action: keyof typeof actionFunctions};

    // action could be "start", "pause" and "stop"

    if (!teamid || !action) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Incomplete fields" });
    }

    const actionFunctions = {
      start: startRound,
      pause: pauseRound,
      stop: stopRound
    };

    const round = await actionFunctions[action](id, teamid);

    if (!round) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Round not found" });
    }

    return NextResponse.json({ code: "OK", message: STATUS_RONDAS.find((status) => status.id === round.status)?.mensaje, data: round });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

async function startRound(id: string, teamid: string) {

  // Check that there are no active rounds
  const activeRounds = await prisma.visor_Round.aggregate({
    _count: {
      id: true,
    },
    where: {
      active: true,
      teamId: teamid,
      status: {
        in: ["activa", "pausada"],
      }
    },
  });

  if (activeRounds._count.id > 0) {
    return NextResponse.json({ code: "BAD_REQUEST", message: "There are active rounds" });
  }

  const round = await prisma.visor_Round.update({
    where: { id },
    data: {
      status: "activa",
    }
  });

  return round;

}

async function pauseRound(id: string) {
  const round = await prisma.visor_Round.update({
    where: { id },
    data: {
      status: "pausada",
    }
  });

  return round;
}

async function stopRound(id: string) {
  const round = await prisma.visor_Round.update({
    where: { id },
    data: {
      status: "terminada",
    }
  });
  
  return round;
}
import { STATUS_RONDAS } from "@/configs/catalogs/visorCatalog";
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

// Delete round by id (Change active to false)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const round = await prisma.visor_Round.findFirst({ where: { id, active: true } });

    if (!round) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Round not found" });
    }

    // Update active and status
    const roundDeleted = await prisma.visor_Round.update({
      where: { id },
      data: {
        active: false,
        status: "terminada"
      }
    });

    return NextResponse.json({ code: "OK", message: "Round deleted successfully", data: roundDeleted });
  } catch (error) {
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { action } = await request.json() as { action: keyof typeof actionFunctions };

    // action could be "start", "pause" and "stop"

    if (!action) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Incomplete fields" });
    }

    const actionFunctions = {
      start: startRound,
      pause: pauseRound,
      stop: stopRound
    };

    if (!(action in actionFunctions)) {
      return NextResponse.json({ code: "INVALID_ACTION", message: "Action is not allowed, it must be: 'start', 'pause', 'stop'" });
    }

    const round = await actionFunctions[action](id);

    if (!round) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Round not found" });
    }

    if (round === "BAD_REQUEST"){
      return NextResponse.json({ code: "BAD_REQUEST", message: "There is an active round" });
    }

    return NextResponse.json({ code: "OK", message: round.status, data: round });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

async function startRound(id: string) {
  // Check if the round exists
  const roundExists = await prisma.visor_Round.findFirst({
    where: { id, active: true },
  });

  if (!roundExists) {
    return null;
  }

  // Check that there are no active rounds
  const activeRounds = await prisma.visor_Round.aggregate({
    _count: {
      id: true,
    },
    where: {
      active: true,
      status: {
        in: ["activa", "pausada"],
      }
    },
  });

  if (activeRounds._count.id > 0) {
    return "BAD_REQUEST";
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
  const roundExists = await prisma.visor_Round.findFirst({
    where: { id, active: true },
  });

  if (!roundExists) {
    return null;
  }

  const round = await prisma.visor_Round.update({
    where: { id },
    data: {
      status: "pausada",
    }
  });

  return round;
}

async function stopRound(id: string) {
  const roundExists = await prisma.visor_Round.findFirst({
    where: { id, active: true },
  });

  if (!roundExists) {
    return null;
  } 

  const round = await prisma.visor_Round.update({
    where: { id },
    data: {
      status: "terminada",
    }
  });

  return round;
}
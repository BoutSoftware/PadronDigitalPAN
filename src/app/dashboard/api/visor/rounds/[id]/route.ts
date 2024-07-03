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
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Incomplete fields" });
    }

    const checkpoint = await prisma.visor_CheckPoint.findFirst({
      where: { id }
    });

    if (!checkpoint) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Checkpoint not found" });
    }

    // Verify if user already registered
    const userChecked = checkpoint.visitedBy.find((v) => v.userId === userId);

    if (userChecked) {
      return NextResponse.json({ code: "ALREADY_CHECKED", message: "User already registered" });
    }

    const visitedByUpdate = await prisma.visor_CheckPoint.update({
      where: { id },
      data: {
        visitedBy: {
          set: [
            ...checkpoint.visitedBy,
            { userId, date: new Date() }
          ]
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "Checkpoint updated successfully", data: visitedByUpdate });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
import prisma from "@/configs/database";
import { Visor_Structure } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Update the coordinator of a structure
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    
    const id = params.id;
    const { coordinatorId, technicalId } = await request.json() as Visor_Structure;

    // For now, skipping validation for technicalId
    if (!coordinatorId) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const structure = await prisma.visor_Structure.update({
      where: { id },
      data: {
        coordinatorId,
        technicalId
      }
    });

    return NextResponse.json({ code: "OK", message: "Structure updated", data: structure });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
  
}
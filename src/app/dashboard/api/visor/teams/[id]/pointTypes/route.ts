import prisma from "@/configs/database";
import { Visor_Team } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const id = params.id;
    const { pointTypesIDs } = await request.json() as Visor_Team;

    const team = await prisma.visor_Team.update({
      where: { id },
      data: {
        pointTypesIDs
      }
    }); 

    return NextResponse.json({ code: "OK", message: "Team updated succesfully", data: team });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}
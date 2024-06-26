import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

// Ejemplo para acceder a la ruta PATCH de la API: http://localhost:3020/dashboard/api/visor/members/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string }}) {
  try {

    const id = params.id;

    const { newStatus } = await request.json() as { newStatus: boolean | null } ; 
    
    const memberUpdated = await prisma.visor_Caminantes.update({
      where: {
        id
      },
      data: {
        // if newStatus is null, invert current status
        active: newStatus === null || newStatus === undefined ? !(await prisma.visor_Caminantes.findFirst({ where: { id }}))?.active : newStatus
      }
    });


    return NextResponse.json({ code: "OK", message: "Member updated succesfully", data: memberUpdated });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
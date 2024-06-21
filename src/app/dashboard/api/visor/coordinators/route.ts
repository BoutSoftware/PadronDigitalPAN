import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";


// Ejemplo de como acceder a la ruta GET de la API: http://localhost:3000/api/visor/users/coordinators?onlyFree=true
// Cuando se mande el parametro onlyFree=true solo traera los usuarios que sean coordinadores libres
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const onlyFree = searchParams.get("onlyFree") === "true";

    const users = await prisma.visor_User.findMany({
      where: {
        rol: "Coordinator",
        active: true,
        ...(onlyFree ? { Coordinators: { none: { } } } : undefined)
      },
      include: {
        Coordinators: true
      }
    });

    return NextResponse.json(users);


  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

// Get technicals without structure
// Ejemplo de como acceder a la ruta GET de la API: http://localhost:3020/dashboard/api/visor/technicals?onlyFree=true
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const onlyFree = searchParams.get("onlyFree") === "true";

    const technicals = await prisma.visor_User.findMany({
      where: {
        rol: "Technical",
        ...(onlyFree ? { title: null } : undefined)
      },
    });

    return NextResponse.json({ code: "OK", message: "Technicals retrieved succesfully", data: technicals });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
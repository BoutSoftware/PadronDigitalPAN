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
        active: true,
        rol: "Staff",
        ...(onlyFree ? {
          c: {
            none: {
              active: true
            }
          },
          SubCoordinators: {
            none: {
              active: true
            }
          },
          Auxiliaries: {
            none: {
              active: true
            }
          }
        } : undefined)
      },
      include: {
        Coordinators: true
      }
    });

    if (!users.length) {
      return NextResponse.json({ code: "NOT_FOUND", message: "No coordinators found" });
    }

    return NextResponse.json({ code: "OK", message: "Coordinators retrieved succesfully", data: users });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}


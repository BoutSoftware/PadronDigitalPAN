import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuxiliarWaterFall } from "./configs/userGroups/visorUserGroups";
import { TITULOS } from "./configs/catalogs/visorCatalog";

interface IProtectedPath {
  path: string;
  filter: (title: typeof TITULOS[number]["id"]) => boolean;
}

// Aqui se van a colocar las rutas protegidas con su respecto filtro
// Cualquier ruta no colocada en este arreglo no esta protegida y pueden acceder
const protectedRoutes: IProtectedPath[] = [
  // Por ejemplo, el usuario debe de cumplir con el filtro isAuxiliarWaterFall para poder acceder a la ruta /dashboard/api/visor/subcoordinators
  // {path: "/dashboard/api/visor/subcoordinators", filter: isAuxiliarWaterFall}

];

export function middleware(request: NextRequest, req: NextApiRequest, res: NextApiResponse) {
  const response = NextResponse.next();
  // TODO: No estoy utilizando el token, ya que se necesita otra libreria para manejarlo. 
  const title = request.cookies.get("visorTitle")?.value as typeof TITULOS[number]["id"];

  const protectedPath = protectedRoutes.find(({ path }) => path === request.nextUrl.pathname);
  if (protectedPath && !protectedPath.filter(title)) {
    console.log("no autorizado");

    return NextResponse.json({ code: "NOT_AUTHORIZED", message: "No autorizado" });
  } else {
    console.log("autorizado");
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

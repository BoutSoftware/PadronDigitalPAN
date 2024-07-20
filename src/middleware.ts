import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuxiliarWaterFall } from "./configs/userGroups/visorUserGroups";
import { TITULOS } from "./configs/catalogs/visorCatalog";

const protectedRoutes = [
  {path: "/dashboard/api/visor/subcoordinators", filter: isAuxiliarWaterFall}

];

export function middleware(request: NextRequest, req: NextApiRequest, res: NextApiResponse) {
  const response = NextResponse.next();
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

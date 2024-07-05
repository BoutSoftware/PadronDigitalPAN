import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { TITULOS, ESTRUCTURAS } from "@/configs/catalogs/visorCatalog";
import { VisGeoConf } from "@prisma/client";


type team = {
  id: string;
  geographicConf: VisGeoConf;
  pointTypesIDs: string[];
}

type UserContext = {
  id: string;
  title: typeof TITULOS[number]["id"];
  isAdmin: boolean;
  structureId: typeof ESTRUCTURAS[number]["id"] | null;
  geographicConf: VisGeoConf;
  pointTypesIDs: string[];
  teams: team[];
}

// isCoordiantorGroup("miTitulo")
// isAxuliiaryGroup("miTitulo")
// isEnlace("miTitulo") || isAxuliary("miTitulo")
// isAxuliaryWaterfall("miTitulo") !== isAxuliiary("miTitulo")
// ------------------------------------------
// isValid( "miTitulo", include: { "axuliaryGroup", "enlace", "caminante" } exclude)
// 

export async function POST(request: NextRequest) {
  try {
    const id = await request.json();
    const user = await prisma.visor_User.findFirst({
      where: {
        userId: id
      },
      select: {
        id: true,
        title: true,
      }
    });

    if (!user) {
      return NextResponse.json({ code: "NOT_FOUND", message: "User not found" });
    }

    const userContext: UserContext = {
      id: user.id,
      title: user.title as typeof TITULOS[number]["id"],
      isAdmin: user.title === "admin" as typeof TITULOS[number]["id"],
      structureId: null,
      geographicConf: {
        geographicLevel: "",
        values: []
      },
      pointTypesIDs: [],
      teams: []
    };

  }
  catch (err) {
    console.log(err);
  }
}




















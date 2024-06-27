// import { CONFIGURACIONES_GEOGRAFICAS } from "@/configs/catalogs/visorCatalog";
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const geographicLevel = searchParams.get("geographicLevel") as keyof typeof geographicFunctions;
    const municipios = searchParams.get("municipios")?.split(",") as string[];

    if (!geographicLevel) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Configuration is missing" });
    }

    const geographicFunctions = {
      colonias: getColonias,
      municipios: getMunicipios,
      delegaciones: getDelegaciones,
      distritosLocales: getDistritosLocales,
      secciones: getElectoralSection
    };

    const geographicData = await geographicFunctions[geographicLevel]({ municipios });

    return NextResponse.json({
      code: "OK",
      message: `${geographicLevel} retrieved successfully`,
      data: geographicData,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });

  }
}



// Function to query the database for geographic configuration based on the geographic level
export async function getColonias({ municipios }: { municipios: string[] }) {
  const colonias = await prisma.colonia.findMany({
    where: {
      municipioId: (!municipios.length) ? {
        in: municipios
      } : undefined
    }
  });

  return colonias;
}

export async function getMunicipios({ municipios }: { municipios: string[] }) {
  const resultadoMunicipios = await prisma.municipio.findMany({
    where: {
      id: (!municipios.length) ? {
        in: municipios
      } : undefined
    }
  });

  return resultadoMunicipios;
}

export async function getDelegaciones({ municipios }: { municipios: string[] }) {
  // TODO: Esto NECESITA un implementacion mucho mas limpia
  // Este es el id del municipio de queretaro xd
  if (!municipios.length || "667bcf8e6ae4f348d52a3af1" in municipios) {
    return [];
  }

  const delegaciones = await prisma.delegation.findMany();

  return delegaciones;
}

export async function getDistritosLocales({ municipios }: { municipios: string[] }) {
  const distritosLocales = await prisma.localDistric.findMany({
    where: {
      ElectoralSections: {
        some: {
          municipioId: (!municipios.length) ? {
            in: municipios
          } : undefined
        }
      }
    }
  });

  return distritosLocales;
}

export async function getElectoralSection({ municipios }: { municipios: string[] }) {
  const electoralSection = await prisma.electoralSection.findMany({
    where: {
      municipioId: (!municipios.length) ? {
        in: municipios
      } : undefined
    }
  });

  return electoralSection;
}
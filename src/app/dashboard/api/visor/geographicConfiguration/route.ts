// import { CONFIGURACIONES_GEOGRAFICAS } from "@/configs/catalogs/visorCatalog";
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET( request: NextRequest ) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    
    const geographicLevel = searchParams.get("geographicLevel") as keyof typeof geographicFunctions;
    const values = searchParams.get("values")?.split(",") as string[];


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

    const geographicData = await geographicFunctions[geographicLevel](values);

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
export async function getColonias(values: string[]) {
  const colonias = await prisma.colonia.findMany({
    where: {
      municipioId: {
        in: values
      }
    }
  });

  return colonias;
}

export async function getMunicipios(values: string[]) {
  const municipios = await prisma.municipio.findMany({
    where: {
      id: {
        in: values
      }
    }
  });

  return municipios;
}

export async function getDelegaciones(values: string[]) {
  // TODO: Esto NECESITA un implementacion mucho mas limpia
  // Este es el id del municipio de queretaro xd
  if (!("667bcf8e6ae4f348d52a3af1" in values)) {
    return [];
  }

  const delegaciones = await prisma.delegation.findMany();

  return delegaciones;
}

export async function getDistritosLocales(values: string[]) {
  const distritosLocales = await prisma.localDistric.findMany({
    where: {
      municipioId: {
        in: values
      }
    }
  });

  return distritosLocales;
}

export async function getElectoralSection(values: string[]) {
  const electoralSection = await prisma.electoralSection.findMany({
    where: {
      LocalDistric: {
        municipioId: {
          in: values
        }
      }
    }
  });

  return electoralSection;
}
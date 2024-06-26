// import { CONFIGURACIONES_GEOGRAFICAS } from "@/configs/catalogs/visorCatalog";
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

// Example: http://localhost:3020/dashboard/api/visor/geographicConfiguration?configuration=%7B%22geographicLevel%22%3A%22colonias%22%2C%22values%22%3A%5B%2266180b33ecdc61ace386d69c%22%2C%226673332c95f06ac335cd03d6%22%5D%7D
// Example: http://localhost:3020/dashboard/api/visor/geographicConfiguration?configuration=%7B%22geographicLevel%22%3A%22colonias%22%7D
export async function GET( request: NextRequest ) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    
    const configuration = searchParams.get("configuration");
    

    if (!configuration) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Configuration is missing" });
    }

    // const { geographicLevel, values } = JSON.parse(configuration) as { geographicLevel: typeof CONFIGURACIONES_GEOGRAFICAS[number]["id"]; values: string[] };
    const { geographicLevel, values } = JSON.parse(configuration) as { geographicLevel: keyof typeof geographicFunctions; values: string[] };

    
    // if (!CONFIGURACIONES_GEOGRAFICAS.find((geographic) => geographic.id === geographicLevel)) {
    //   return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Configuration no valida" });
    // }

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
      id: {
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
  const delegaciones = await prisma.delegation.findMany({
    where: {
      id: {
        in: values
      }
    }
  });

  return delegaciones;
}

export async function getDistritosLocales(values: string[]) {
  const distritosLocales = await prisma.localDistric.findMany({
    where: {
      id: {
        in: values
      }
    }
  });

  return distritosLocales;
}

export async function getElectoralSection(values: string[]) {
  const electoralSection = await prisma.electoralSection.findMany({
    where: {
      id: {
        in: values
      }
    }
  });

  return electoralSection;
}
import { CONFIGURACIONES_GEOGRAFICAS } from "@/configs/catalogs/visorCatalog";
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

interface GeoConfig {
  geographicLevel: keyof typeof CONFIGURACIONES_GEOGRAFICAS;
  values: string[];
}

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    
    // geographicConfiguration must be encoded 
    const geographicConfiguration: GeoConfig = await JSON.parse(searchParams.get("geographicConfiguration") as string);
    const targetLevel = searchParams.get("targetLevel") as keyof typeof geographicFunctions || geographicConfiguration.geographicLevel as keyof typeof geographicFunctions;


    if(!geographicConfiguration) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Configuration is missing" });
    }    

    const geographicFunctions = {
      colonias: getColonias,
      municipios: getMunicipios,
      delegaciones: getDelegaciones,
      distritosLocales: getDistritosLocales,
      secciones: getElectoralSection
    };

    const geographicData = await geographicFunctions[targetLevel]({ values: geographicConfiguration.values });

    return NextResponse.json({
      code: "OK",
      message: `${targetLevel} retrieved successfully`,
      data: geographicData
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

interface GeoData {
  lat: number;
  lng: number;
}

async function getColonias({ values }: { values: string[] | undefined }) {
  // const colonias = await prisma.colonia.findMany({
  //   where: {
  //     id: (coloniasIds?.length) ? {
  //       in: coloniasIds
  //     } : undefined
  //   },
  //   select: {
  //     polygon: true
  //   }
  // });

  const fakeColonias: GeoData[][] = [
    [
      {
        "lat": 20.745422977763113,
        "lng": -100.7448436947487
      },
      {
        "lat": 19.72263815604208,
        "lng": -102.79957168434184
      },
      {
        "lat": 17.60627950109526,
        "lng": -100.74226872888728
      },
      {
        "lat": 20.61925461296346,
        "lng": -99.0139678134759
      },
      {
        "lat": 20.745422977763113,
        "lng": -100.7448436947487
      }
    ],
    [
      {
        "lat": 20.0238654893044,
        "lng": -98.50286258852248
      },
      {
        "lat": 18.74534726969796,
        "lng": -99.55463582115675
      },
      {
        "lat": 17.03065737457547,
        "lng": -99.59370628775534
      },
      {
        "lat": 18.042406852097542,
        "lng": -96.23447295855948
      },
      {
        "lat": 20.0238654893044,
        "lng": -98.50286258852248
      }
    ],
  ];

  return fakeColonias;
}

async function getMunicipios({ values }: { values?: string[] }) {
  // const resultadoMunicipios = await prisma.municipio.findMany({
  //   where: {
  //     id: (municipiosIds?.length) ? {
  //       in: municipiosIds
  //     } : undefined
  //   },
  //   select: {
  //     polygon: true
  //   }
  // });

  const fakeMunicipios: GeoData[][] = [
    [
      {
        "lat": 20.35623955402056,
        "lng": -97.83767026169276
      },
      {
        "lat": 19.545526401570413,
        "lng": -97.15454620720966
      },
      {
        "lat": 20.14789766465185,
        "lng": -96.9485465733312
      },
      {
        "lat": 20.35623955402056,
        "lng": -97.83767026169276
      }
    ],
    [
      {
        "lat": 21.162599040850736,
        "lng": -98.36195304578042
      },
      {
        "lat": 20.472308790517104,
        "lng": -98.68247976621096
      },
      {
        "lat": 20.547948161820685,
        "lng": -97.570789788909
      },
      {
        "lat": 21.005114176973066,
        "lng": -97.6773982687178
      },
      {
        "lat": 21.24552889113687,
        "lng": -97.8463421230189
      },
      {
        "lat": 21.543534157042544,
        "lng": -98.1307644890501
      },
      {
        "lat": 21.162599040850736,
        "lng": -98.36195304578042
      }
    ],
  ];

  return fakeMunicipios;
}

async function getDelegaciones({ values }: { values?: string[] }) {
  // const delegaciones = await prisma.delegation.findMany({
  //   where: {
  //     id: (delegacionesIds?.length) ? {
  //       in: delegacionesIds
  //     } : undefined
  //   },
  //   select: {
  //     polygon: true
  //   }
  // });

  const fakeDelegaciones: GeoData[][] = [
    [
      {
        "lat": 16.989549135037166,
        "lng": -96.28389314150492
      },
      {
        "lat": 16.952190962380584,
        "lng": -96.81284518150036
      },
      {
        "lat": 16.756708825350998,
        "lng": -96.95494959095461
      },
      {
        "lat": 16.25711525325103,
        "lng": -96.30110538371909
      },
      {
        "lat": 16.35048563012711,
        "lng": -95.96329797265376
      },
      {
        "lat": 16.94582770344482,
        "lng": -95.19000372478362
      },
      {
        "lat": 16.989549135037166,
        "lng": -96.28389314150492
      }
    ],
    [
      {
        "lat": 17.97734174663799,
        "lng": -94.1733462339647
      },
      {
        "lat": 17.32536178074011,
        "lng": -94.42219876795778
      },
      {
        "lat": 17.325372150209247,
        "lng": -93.977994787388
      },
      {
        "lat": 17.97734174663799,
        "lng": -94.1733462339647
      }
    ],
  ];

  return fakeDelegaciones;
}

async function getDistritosLocales({ values }: { values?: string[] }) {
  // const distritosLocales = await prisma.districtLocal.findMany({
  //   where: {
  //     id: (distritosLocalesIds?.length) ? {
  //       in: distritosLocalesIds
  //     } : undefined
  //   },
  //   select: {
  //     polygon: true
  //   }
  // });

  const fakeDistritosLocales: GeoData[][] = [
    [
      {
        "lat": 17.32547472285134,
        "lng": -95.88873183243588
      },
      {
        "lat": 17.25750673140024,
        "lng": -95.36414685324118
      },
      {
        "lat": 17.69820839299041,
        "lng": -95.25742416522421
      },
      {
        "lat": 17.32547472285134,
        "lng": -95.88873183243588
      }
    ],
    [
      {
        "lat": 16.458342006956315,
        "lng": -94.17391386450711
      },
      {
        "lat": 16.390160049476805,
        "lng": -93.9517862053988
      },
      {
        "lat": 16.509484774293682,
        "lng": -93.95188412736397
      },
      {
        "lat": 16.458342006956315,
        "lng": -94.17391386450711
      }
    ],
  ];

  return fakeDistritosLocales;
}


async function getElectoralSection({ values }: { values?: string[] }) {
  // const sections = await prisma.electoralSection.findMany({
  //   where: {
  //     id: (sectionsIds?.length) ? {
  //       in: sectionsIds
  //     } : undefined
  //   },
  //   select: {
  //     polygon: true
  //   }
  // });

  const fakeSections: GeoData[][] = [
    [
      {
        "lat": 16.951920972269463,
        "lng": -93.48111729350731
      },
      {
        "lat": 17.240655152223624,
        "lng": -92.97496186293242
      },
      {
        "lat": 17.54578556518109,
        "lng": -93.40054278783143
      },
      {
        "lat": 16.0234155739916,
        "lng": -92.96588380996181
      },
      {
        "lat": 16.884169218892367,
        "lng": -92.55851851754774
      },
      {
        "lat": 16.951920972269463,
        "lng": -93.48111729350731
      }
    ],
    [
      {
        "lat": 17.427372591555113,
        "lng": -97.42567254846583
      },
      {
        "lat": 16.989650239804348,
        "lng": -97.2703444497159
      },
      {
        "lat": 17.261314300948072,
        "lng": -96.81755273396521
      },
      {
        "lat": 17.473166118856483,
        "lng": -96.68427137968919
      },
      {
        "lat": 17.515515596165415,
        "lng": -96.89740555095521
      },
      {
        "lat": 17.427372591555113,
        "lng": -97.42567254846583
      }
    ]
  ];

  return fakeSections;
}


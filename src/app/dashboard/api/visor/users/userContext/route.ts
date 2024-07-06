import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { TITULOS, ESTRUCTURAS, CONFIGURACIONES_GEOGRAFICAS } from "@/configs/catalogs/visorCatalog";
import { VisGeoConf } from "@prisma/client";

type team = {
  id: string;
  geographicConf: VisGeoConf;
  pointTypesIDs: string[];
}

type UserContext = {
  id: string;
  title: visUserTitle;
  isAdmin: boolean;
  structureId: userStructure;
  geographicConf: VisGeoConf;
  pointTypesIDs: string[];
  teams: team[] | team;
}

// isCoordiantorGroup("miTitulo")
// isAxuliiaryGroup("miTitulo")
// isEnlace("miTitulo") || isAxuliary("miTitulo")
// isAxuliaryWaterfall("miTitulo") !== isAxuliiary("miTitulo")
// ------------------------------------------
// isValid( "miTitulo", include: { "axuliaryGroup", "enlace", "caminante" } exclude)
// 

type visUserTitle = typeof TITULOS[number]["id"];
type userStructure = typeof ESTRUCTURAS[number]["id"] | null;

const coordinatorTitles: visUserTitle[] = [
  "coordinador",
  "adjCoordinador",
  "tecCoordinador"
];

const subcoordinatorTitles: visUserTitle[] = [
  "subcoordinador",
  "tecSubcoordinador"
];

const auxiliarTitles: visUserTitle[] = [
  "auxiliar",
  "tecAuxiliar"
];

const teamMemberTitles: visUserTitle[] = [
  "enlace",
  "caminante"
];

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    const user = await prisma.visor_User.findFirst({
      where: {
        userId: id,
        active: true
      },
      select: {
        id: true,
        title: true,
      }
    });

    if (!user) {
      return NextResponse.json({ code: "NOT_FOUND", message: "User not found" });
    }

    // if title is null is no a define user visor
    if (user.title === null) {
      return NextResponse.json({ code: "NO_TITLE", message: "User without define role in visor" });
    }

    const userContext: UserContext = {
      id: user.id,
      title: user.title as visUserTitle,
      isAdmin: user.title === "admin" as visUserTitle,
      structureId: null,
      geographicConf: {
        geographicLevel: "",
        values: []
      },
      pointTypesIDs: [],
      teams: []
    };

    const userTitle = user.title as visUserTitle;

    if (coordinatorTitles.includes(userTitle)) {
      await getCoordinatorInfo(user.id, userContext);
    }
    else if (subcoordinatorTitles.includes(userTitle)) {
      await getSubCoordinatorInfo(user.id, userContext);
    }
    else if (auxiliarTitles.includes(userTitle)) {
      await getAuxiliaryInfo(user.id, userContext);
    }
    else if (teamMemberTitles.includes(userTitle)) {
      await getEnlaceInfo(user.id, userContext);
    }

    return NextResponse.json({ code: "OK", message: "User context", data: userContext });
  }
  catch (err) {
    console.log(err);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

async function getCoordinatorInfo(userId: string, userContext: UserContext) {
  const structure = await prisma.visor_structureCoordinator.findFirst({
    where: {
      OR: [
        { visorUserId: userId },
        { technicalId: userId },
        { attachId: userId }
      ],
      active: true
    },
    select: {
      structureId: true
    }
  });

  if (!structure) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Structure not found" });
  }

  // Add strcture info to context
  userContext.structureId = structure.structureId as userStructure;

  const userInfo = await prisma.visor_SubCoordinator.findFirst({
    where: {
      structureId: structure.structureId
    },
    include: {
      Auxiliaries: {
        where: {
          active: true
        },
        include: {
          Teams: {
            where: {
              active: true
            },
            select: {
              id: true,
              pointTypesIDs: true,
              geographicConf: true
            }
          }
        }
      }
    }
  });

  if (!userInfo) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Information user not found" });
  }

  // Add pointTypes, gooConf and teams info
  userContext.pointTypesIDs = userInfo.pointTypesIDs;

  // Add geographic configuration
  const municipios = userInfo.Auxiliaries.map(aux => aux.municipiosIDs);
  const values = municipios.reduce((acc, val) => acc.concat(val), []);
  userContext.geographicConf = {
    geographicLevel: "municipios" as typeof CONFIGURACIONES_GEOGRAFICAS[number]["id"],
    values: Array.from(new Set(values))
  };

  // Add teams info
  const teams = userInfo.Auxiliaries.flatMap(aux => aux.Teams);
  userContext.teams = teams;
}

async function getSubCoordinatorInfo(userId: string, userContext: UserContext) {
  const structure = await prisma.visor_SubCoordinator.findFirst({
    where: {
      OR: [
        { userId: userId },
        { technicalId: userId },
      ],
      active: true
    },
    include: {
      Auxiliaries: {
        where: {
          active: true
        },
        include: {
          Teams: {
            where: {
              active: true
            },
            select: {
              id: true,
              pointTypesIDs: true,
              geographicConf: true
            }
          }
        }
      }
    }
  });

  if (!structure) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Structure not found" });
  }

  // Add strcture info to context
  userContext.structureId = structure.structureId as userStructure;

  // Add pointTypes, gooConf and teams info
  userContext.pointTypesIDs = structure.pointTypesIDs;

  // Add geographic configuration
  const municipios = structure.Auxiliaries.map(aux => aux.municipiosIDs);
  const values = municipios.reduce((acc, val) => acc.concat(val), []);
  userContext.geographicConf = {
    geographicLevel: "municipios" as typeof CONFIGURACIONES_GEOGRAFICAS[number]["id"],
    values: Array.from(new Set(values))
  };

  // Add teams info
  const teams = structure.Auxiliaries.flatMap(aux => aux.Teams);
  userContext.teams = teams;
}

async function getAuxiliaryInfo(userId: string, userContext: UserContext) {
  const auxiliary = await prisma.visor_Auxiliaries.findFirst({
    where: {
      OR: [
        { userId: userId },
        { technicalId: userId },
      ],
      active: true
    },
    include: {
      Teams: {
        where: {
          active: true
        },
        select: {
          id: true,
          pointTypesIDs: true,
          geographicConf: true
        }
      },
      SubCoordinator: true
    }
  });

  if (!auxiliary) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Auxiliary not found" });
  }

  // Add strcture info to context
  userContext.structureId = auxiliary.SubCoordinator.structureId as userStructure;

  // Add pointTypes, gooConf and teams info
  userContext.pointTypesIDs = auxiliary.SubCoordinator.pointTypesIDs;

  // Add geographic configuration
  userContext.geographicConf = {
    geographicLevel: "municipios" as typeof CONFIGURACIONES_GEOGRAFICAS[number]["id"],
    values: auxiliary.municipiosIDs
  };

  // Add teams info
  userContext.teams = auxiliary.Teams;
}

async function getEnlaceInfo(userId: string, userContext: UserContext) {
  const userInfo = await prisma.visor_Team.findFirst({
    where: {
      OR: [
        { linkId: userId },
        {
          Caminantes: {
            some: {
              userId: userId,
              active: true
            }
          }
        }
      ],
      active: true
    },
    select: {
      id: true,
      pointTypesIDs: true,
      geographicConf: true,
      Auxiliary: {
        include: {
          SubCoordinator: true
        }
      }
    }
  });

  if (!userInfo) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Information user not found" });
  }

  // Add strcture info to context
  userContext.structureId = userInfo.Auxiliary.SubCoordinator.structureId as userStructure;

  // Add pointTypes of their team
  userContext.pointTypesIDs = userInfo.pointTypesIDs;

  // Add geographic configuration of their team
  userContext.geographicConf = userInfo.geographicConf;

  // Add info only their team
  userContext.teams = {
    id: userInfo.id,
    pointTypesIDs: userInfo.pointTypesIDs,
    geographicConf: userInfo.geographicConf
  };
}
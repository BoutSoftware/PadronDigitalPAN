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
  structureId?: userStructure;
  geographicConf?: VisGeoConf;
  pointTypesIDs?: string[];
  team?: team;
}

// isCoordiantorGroup("miTitulo")
// isAxuliiaryGroup("miTitulo")
// isEnlace("miTitulo") || isAxuliary("miTitulo")
// isAxuliaryWaterfall("miTitulo") !== isAxuliiary("miTitulo")
// ------------------------------------------
// isValid( "miTitulo", include: { "axuliaryGroup", "enlace", "caminante" } exclude)
// 

type visUserTitle = typeof TITULOS[number]["id"];
type userStructure = typeof ESTRUCTURAS[number]["id"];

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
    const { userId } = await request.json();
    const visorUser = await prisma.visor_User.findFirst({
      where: {
        userId,
        active: true
      },
      select: {
        id: true,
        title: true,
      }
    });

    if (!visorUser) {
      return NextResponse.json({ code: "NOT_FOUND", message: "User not found" });
    }

    // if title is null is no a define user visor
    if (visorUser.title === null) {
      return NextResponse.json({ code: "NO_TITLE", message: "User without define role in visor" });
    }

    const userContext: UserContext = {
      id: visorUser.id,
      title: visorUser.title as visUserTitle,
      isAdmin: visorUser.title === "admin" as visUserTitle,
      structureId: undefined,
      geographicConf: undefined,
      pointTypesIDs: undefined,
      team: undefined
    };

    const userTitle = visorUser.title as visUserTitle;

    if (coordinatorTitles.includes(userTitle)) {
      await getCoordinatorInfo(visorUser.id, userContext);
    }
    else if (subcoordinatorTitles.includes(userTitle)) {
      await getSubCoordinatorInfo(visorUser.id, userContext);
    }
    else if (auxiliarTitles.includes(userTitle)) {
      await getAuxiliaryInfo(visorUser.id, userContext);
    }
    else if (teamMemberTitles.includes(userTitle)) {
      await getTeamMemberInfo(visorUser.id, userContext);
    }

    return NextResponse.json({ code: "OK", message: "User context", data: userContext });
  }
  catch (err) {
    console.log(err);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

async function getCoordinatorInfo(visorUserId: string, userContext: UserContext) {
  const structure = await prisma.visor_structureCoordinator.findFirst({
    where: {
      OR: [
        { visorUserId: visorUserId },
        { technicalId: visorUserId },
        { attachId: visorUserId }
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
      }
    }
  });

  if (!userInfo) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Information user not found" });
  }

  // Si no tiene un subcoordinador asignado no tiene tipos de punto asiganados pr lo tanto será undefined
  //TODO: Definir si se va a enviar como undefined o lista vacia
  userContext.pointTypesIDs = userInfo.pointTypesIDs;
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
      }
    }
  });

  if (!structure) {
    return NextResponse.json({ code: "NOT_FOUND", message: "Structure not found" });
  }

  // Add strcture info to context
  userContext.structureId = structure.structureId as userStructure;

  // Add pointTypes
  userContext.pointTypesIDs = structure.pointTypesIDs;
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
}

async function getTeamMemberInfo(userId: string, userContext: UserContext) {
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
  userContext.team = {
    id: userInfo.id,
    pointTypesIDs: userInfo.pointTypesIDs,
    geographicConf: userInfo.geographicConf
  };
}
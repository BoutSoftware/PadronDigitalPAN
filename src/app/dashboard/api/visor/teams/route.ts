import { CONFIGURACIONES_GEOGRAFICAS, ESTRUCTURAS } from "@/configs/catalogs/visorCatalog";
import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Visor_Team } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Structure for the response to get teams by structure
interface StructureTeams {
  structureId: string;
  structureType: string;
  teams: {
    id: string;
    name: string;
    linkName: string;
    pointTypesIDs: string[];
    geographicConf: {
      geographicLevel: string;
      values: string[];
    }
  }[];
}

// Get team and separate by structure
export async function GET() {
  try {
    const teams = await prisma.visor_Team.findMany({
      select: {
        id: true,
        name: true,
        pointTypesIDs: true,
        geographicConf: true,
        Link: {
          // include: {
          //   User: {
          //     include: {
          //       Person: {
          //         select: {
          //           name: true,
          //           fatherLastName: true,
          //           motherLastName: true
          //         }
          //       }
          //     }
          //   }
          // }
          select: {
            fullname: true,
          }
        },
        Auxiliary: {
          include: {
            SubCoordinator: true
          }
        }
      }
    });

    const data: StructureTeams[] = [];

    for (const team of teams) {
      const structureId = team.Auxiliary.SubCoordinator.structureId;
      const teamStructure = ESTRUCTURAS.find(e => e.id === structureId);

      // Get the Team's Geographic configuration
      const geoLevel = team.geographicConf.geographicLevel as typeof CONFIGURACIONES_GEOGRAFICAS[number]["id"];
      const geographicConf = {
        geographicLevel: CONFIGURACIONES_GEOGRAFICAS.find((val) => val.id === geoLevel)!.nombre,
        values: [] as string[],
      };
      if (geoLevel === "colonias") {
        geographicConf.values = (await prisma.colonia.findMany({ where: { id: { in: team.geographicConf.values } } })).map((val) => val.name);
      } else if (geoLevel === "delegaciones") {
        geographicConf.values = (await prisma.delegation.findMany({ where: { id: { in: team.geographicConf.values } } })).map((val) => val.name);
      } else if (geoLevel === "distritosLocales") {
        geographicConf.values = (await prisma.localDistric.findMany({ where: { id: { in: team.geographicConf.values } } })).map((val) => val.number.toString());
      } else if (geoLevel === "municipios") {
        geographicConf.values = (await prisma.municipio.findMany({ where: { id: { in: team.geographicConf.values } } })).map((val) => val.name);
      } else if (geoLevel === "secciones") {
        geographicConf.values = (await prisma.electoralSection.findMany({ where: { id: { in: team.geographicConf.values } } })).map((val) => val.number.toString());
      } else {
        geographicConf.values = ["Nivel de Configuración geografico invalido"];
      }

      // Join All team info
      const teamInfo = {
        id: team.id,
        name: team.name,
        // linkName: `${team.Link.User.Person.name} ${team.Link.User.Person.fatherLastName} ${team.Link.User.Person.motherLastName}`,
        linkName: team.Link.fullname,
        pointTypesIDs: team.pointTypesIDs,
        geographicConf
      };

      // Insert the team into a structure (or create a new one)
      const existingStructure = data.find(d => d.structureId === structureId);
      if (existingStructure) {
        existingStructure.teams.push(teamInfo);
      } else {
        data.push({
          structureId,
          structureType: teamStructure!.nombre,
          teams: [teamInfo],
        });
      }
    }


    return NextResponse.json({ code: "OK", message: "Teams retrieved successfully", data: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}

interface createTeam extends Visor_Team {
  caminantes: string[];
}
export async function POST(request: NextRequest) {
  try {
    const { name, geographicConf, linkId, auxiliaryId, pointTypesIDs, caminantes } = (await request.json()) as createTeam;

    if (hasIncompleteFields({ name, geographicConf, linkId, auxiliaryId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const team = await prisma.visor_Team.create({
      data: {
        name,
        geographicConf,
        linkId,
        auxiliaryId,
        pointTypesIDs,
        Caminantes: {
          // TODO: En caso de que ya exista un usuario con ese ID, no lo crea. Y agregar mas logica de validación
          createMany: {
            data: caminantes.map((caminante) => ({ userId: caminante })),
          },
        },
      },
      include: {
        Caminantes: true,
      },
    });



    return NextResponse.json({ code: "OK", message: "Team created succesfully", data: team });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}
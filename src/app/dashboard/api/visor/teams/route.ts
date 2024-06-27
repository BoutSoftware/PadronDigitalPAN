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
          include: {
            User: {
              include: {
                Person: {
                  select: {
                    name: true,
                    fatherLastName: true,
                    motherLastName: true
                  }
                }
              }
            }
          }
        },
        Auxiliary: {
          include: {
            SubCoordinator: {
              include: {
                Structure: {
                  select: {
                    id: true,
                    structureType: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!teams.length) {
      return NextResponse.json({ code: "NOT_FOUND", message: "No teams found" });
    }

    const data: StructureTeams[] = teams.reduce((acc, team) => {
      const structure = team.Auxiliary.SubCoordinator.Structure;
      const { id: structureId, structureType } = structure;
      const teamInfo = {
        id: team.id,
        name: team.name,
        linkName: `${team.Link.User.Person.name} ${team.Link.User.Person.fatherLastName} ${team.Link.User.Person.motherLastName}`,
        pointTypesIDs: team.pointTypesIDs,
        geographicConf: team.geographicConf,
      };
    
      const existingStructure = acc.find(d => d.structureId === structureId);
      if (existingStructure) {
        existingStructure.teams.push(teamInfo);
      } else {
        acc.push({
          structureId,
          structureType,
          teams: [teamInfo],
        });
      }
    
      return acc;
    }, [] as StructureTeams[]);

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
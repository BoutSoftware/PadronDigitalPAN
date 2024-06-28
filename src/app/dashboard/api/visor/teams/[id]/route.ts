import { CONFIGURACIONES_GEOGRAFICAS, ESTRUCTURAS, TIPOS_PUNTO, getTipoPuntos } from "@/configs/catalogs/visorCatalog";
import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const id = params.id;
    const team = await prisma.visor_Team.findUnique({
      where: { id },
      include: {
        Caminantes: {
          select: {
            User: {
              select: {
                User: {
                  select: {
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
            id: true,
            active: true
          }
        },
        Link: {
          select: {
            id: true,
            active: true,
            User: {
              select: {
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
          select: {
            id: true,
            active: true,
            User: {
              select: {
                User: {
                  select: {
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
            SubCoordinator: {
              select: {
                structureId: true
              }
            }
          }
        },
      },
    });

    const geoLevel = team?.geographicConf.geographicLevel as typeof CONFIGURACIONES_GEOGRAFICAS[number]["id"];
    const geographicConf = {
      geographicLevel: CONFIGURACIONES_GEOGRAFICAS.find((val) => val.id === geoLevel)!,
      values: [] as {id: string, name: string}[],
    };
    if (geoLevel === "colonias") {
      geographicConf.values = (await prisma.colonia.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.name }));
    } else if (geoLevel === "delegaciones") {
      geographicConf.values = (await prisma.delegation.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.name }));
    } else if (geoLevel === "distritosLocales") {
      geographicConf.values = (await prisma.localDistric.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({id: val.id, name: val.number.toString()}));
    } else if (geoLevel === "municipios") {
      geographicConf.values = (await prisma.municipio.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.name }));
    } else if (geoLevel === "secciones") {
      geographicConf.values = (await prisma.electoralSection.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.number.toString()}));
    }

    const formatedTeam = {
      ...team,
      Caminantes: team?.Caminantes?.map((caminante) => ({
        // ...caminante,
        id: id,
        name: `${caminante.User?.User.Person.name} ${caminante.User?.User.Person.fatherLastName} ${caminante.User?.User.Person.motherLastName}`,
        active: caminante.active
      })),
      Link: {
        id: team?.Link?.id,
        active: team?.Link?.active,
        name: `${team?.Link?.User.Person.name} ${team?.Link?.User.Person.fatherLastName} ${team?.Link?.User.Person.motherLastName}`,
      },
      Auxiliary: {
        id: team?.Auxiliary?.id,
        active: team?.Auxiliary?.active,
        name: `${team?.Auxiliary?.User.User.Person.name} ${team?.Auxiliary?.User.User.Person.fatherLastName} ${team?.Auxiliary?.User.User.Person.motherLastName}`,
      },
      Structure: team?.Auxiliary.SubCoordinator.structureId ? ESTRUCTURAS.find((s) => s.id === team?.Auxiliary.SubCoordinator.structureId) : null,
      // TiposPunto: {team?.pointTypesIDs ? getTipoPuntos(team?.pointTypesIDs)}
      ...(team?.pointTypesIDs && { TiposPunto: getTipoPuntos(team?.pointTypesIDs) }),
      geographicConf,
      pointTypesIDs: undefined,
      auxiliaryId: undefined,
      linkId: undefined,
      createdAt: undefined,
      
    };



    return NextResponse.json({ code: "OK", message: "Team found", data: formatedTeam });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }

}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const id = params.id;
    const team = await prisma.visor_Team.findUnique({ where: { id } });
    
    if (!team) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Team not found" });
    }

    const deletesMembers = await prisma.visor_User.updateMany({
      where: {
        Caminantes: {
          some: {
            teamId: id
          }
        }
      },
      data: {
        title: null
      }
    });

    const deletedTeam = await prisma.visor_Team.update({
      where: { id },
      data: {
        active: false,
        Link: {
          update: {
            title: null,
          },
          // TODO: tambien quitar la relacion entre usuario_visor ( enlace ) y equipo?
          disconnect: true
        },
        Caminantes: {
          updateMany: {
            where: {
              teamId: id,
            },
            data: {
              active: false,
              // TODO: tambien quitar la relacion entre usuario_visor y caminante?
              userId: null,
            }
          }
        }
      },
    });

    // TODO: Aduitoria para checar quien elimino el equipo??


    return NextResponse.json({ code: "OK", message: "Team deleted succesfully", data: deletedTeam });


  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
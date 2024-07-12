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
                fullname: true,
              }
            },
            id: true,
            active: true,
          }
        },
        Link: {
          select: {
            id: true,
            active: true,
            fullname: true,
          }
        },
        Auxiliary: {
          select: {
            id: true,
            active: true,
            municipiosIDs: true,
            User: {
              select: {
                fullname: true
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
      values: [] as { id: string, name: string }[],
    };
    if (geoLevel === "colonias") {
      geographicConf.values = (await prisma.colonia.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.name }));
    } else if (geoLevel === "delegaciones") {
      geographicConf.values = (await prisma.delegation.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.name }));
    } else if (geoLevel === "distritosLocales") {
      geographicConf.values = (await prisma.localDistric.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.number.toString() }));
    } else if (geoLevel === "municipios") {
      geographicConf.values = (await prisma.municipio.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.name }));
    } else if (geoLevel === "secciones") {
      geographicConf.values = (await prisma.electoralSection.findMany({ where: { id: { in: team?.geographicConf.values } } })).map((val) => ({ id: val.id, name: val.number.toString() }));
    }

    const formatedTeam = {
      ...team,
      Caminantes: team?.Caminantes?.map((caminante) => ({
        id: caminante.id,
        name: caminante.User.fullname,
        active: caminante.active
      })),
      Link: {
        id: team?.Link?.id,
        active: team?.Link?.active,
        name: team?.Link?.fullname,
      },
      Auxiliary: {
        id: team?.Auxiliary?.id,
        active: team?.Auxiliary?.active,
        name: team?.Auxiliary?.User.fullname,
        municipios: team?.Auxiliary.municipiosIDs,
      },
      Structure: team?.Auxiliary.SubCoordinator.structureId ? ESTRUCTURAS.find((s) => s.id === team?.Auxiliary.SubCoordinator.structureId) : null,
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

    const deletedMembers = await prisma.visor_User.updateMany({
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
        },
        Caminantes: {
          updateMany: {
            where: {
              teamId: id,
            },
            data: {
              active: false,
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
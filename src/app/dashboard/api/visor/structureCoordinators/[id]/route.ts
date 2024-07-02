import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { hasIncompleteFields } from "@/utils";

// get coordinator
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    const coordinator = await prisma.visor_structureCoordinator.findFirst({
      where: { id, active: true },
      include: {
        Technical: true,
        Attach: true,
        VisorUser: true
      }
    });

    if (!coordinator) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Coordinator not found" });
    }

    return NextResponse.json({ code: "OK", message: "Coordinator retrieved successfully", data: coordinator });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  interface reqBody {
    structureId: string;
    technicalId: string;
    attachId: string;
  }

  try {
    const reqBody = await request.json() as reqBody;
    const { structureId, technicalId, attachId } = reqBody;
    const id = params.id;

    if (hasIncompleteFields({ structureId, technicalId, attachId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    if (technicalId === attachId) {
      return NextResponse.json({ code: "BAD_FIELDS", message: "technicalId and auditorId cannot be the same" });
    }

    // Verify if coordinator exists
    const coordinatorExists = await prisma.visor_structureCoordinator.findFirst({
      where: { id },
      include: {
        Technical: true,
        Attach: true
      }
    });

    if (!coordinatorExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Coordinator not found" });
    }

    // Update title of free users (when a user is change in structure)
    await prisma.visor_structureCoordinator.update({
      where: { id },
      data: {
        Technical: {
          update: {
            title: technicalId === coordinatorExists.technicalId ?
              coordinatorExists.Technical.title : null
          }
        },
        Attach: {
          update: {
            title: attachId === coordinatorExists.attachId ?
              coordinatorExists.Attach.title : null
          }
        }
      }
    });

    // Update coordination info of structure and titles of the users
    const updateResult = await prisma.visor_structureCoordinator.update({
      where: { id },
      data: {
        structureId,
        Technical: {
          connect: {
            id: technicalId,
          },
          update: {
            title: "Tecnico de Coordinador"
          }
        },
        Attach: {
          connect: {
            id: attachId,
          },
          update: {
            title: "Adjunto de Coordinador"
          }
        },
      }
    });

    return NextResponse.json({ code: "OK", message: "Coordinator updated successfully", data: updateResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

// Change active status to false for all dependecies of a coordinator and change user titles to null
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Verify if coordinator exists
    const coordinatorExists = await prisma.visor_structureCoordinator.findFirst({
      where: { id }
    });

    if (!coordinatorExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Coordinator not found" });
    }

    // if try to "deleted" again
    if (!coordinatorExists.active){
      return NextResponse.json({ code: "BAD_REQUEST", message: "Coordinator already deleted" });
    }

    // Get info of all relations of this structure
    const subcoordinator = await prisma.visor_SubCoordinator.findFirst({
      where: {
        structureId: "territorial", active: true,
      },
      include: {
        Technical: true,
        User: true,
        // Add clause where to filter only active registers
        Auxiliaries: {
          where: {
            active: true
          },
          include: {
            User: true,
            Technical: true,
            Teams: {
              where: {
                active: true
              },
              include: {
                Link: true,
                Caminantes: {
                  where: {
                    active: true
                  },
                  include: {
                    User: true
                  }
                },
                Batchs: {
                  where: {
                    active: true
                  }
                },
                Rounds: {
                  where: {
                    active: true
                  }
                },
              }
            }
          }
        }
      }
    });

    if (subcoordinator) {
      // Get batchs info
      const batchs = subcoordinator.Auxiliaries.flatMap(aux => aux.Teams.flatMap(team => team.Batchs));

      // update batchs status to false
      if (batchs) {
        await prisma.visor_Batch.updateMany({
          where: {
            id: {
              in: batchs.map(batch => batch.id)
            }
          },
          data: {
            active: false
          }
        });
      }

      // Get rounds info
      const rounds = subcoordinator.Auxiliaries.flatMap(aux => aux.Teams.flatMap(team => team.Rounds));

      // update rounds status to false
      if (rounds) {
        await prisma.visor_Round.updateMany({
          where: {
            id: {
              in: rounds.map(round => round.id)
            }
          },
          data: {
            active: false
          }
        });
      }

      // Get caminantes info
      const caminantes = subcoordinator.Auxiliaries.flatMap(aux => aux.Teams.flatMap(team => team.Caminantes));
      const users = caminantes.map(caminante => caminante.User);

      if (caminantes) {
        // update title to users
        if (users) {
          await prisma.visor_User.updateMany({
            where: {
              id: {
                in: users.map(user => user.id)
              }
            },
            data: {
              title: null
            }
          });
        }

        // update caminantes status to false
        await prisma.visor_Caminantes.updateMany({
          where: {
            id: {
              in: caminantes.map(caminante => caminante.id)
            }
          },
          data: {
            active: false,
          }
        });
      }

      // Get team info
      const teams = subcoordinator.Auxiliaries.flatMap(aux => aux.Teams);
      const teamLinks = teams.flatMap(team => team.Link);

      if (teams) {
        // update title to links
        if (teamLinks) {
          await prisma.visor_User.updateMany({
            where: {
              id: {
                in: teamLinks.map(link => link.id)
              }
            },
            data: {
              title: null
            }
          });
        }

        // update team status to false
        await prisma.visor_Team.updateMany({
          where: {
            id: {
              in: teams.map(team => team.id)
            }
          },
          data: {
            active: false
          }
        });
      }

      // Get auxiliaries info
      const auxiliaries = subcoordinator.Auxiliaries;
      const auxUsers = auxiliaries.map(aux => aux.User);
      const auxTechnicals = auxiliaries.map(aux => aux.Technical);

      if (auxiliaries) {
        // update title to users auxiliaries
        if (auxUsers) {
          await prisma.visor_User.updateMany({
            where: {
              id: {
                in: auxUsers.map(user => user.id)
              }
            },
            data: {
              title: null
            }
          });
        }

        // update title to users technicals
        if (auxTechnicals) {
          await prisma.visor_User.updateMany({
            where: {
              id: {
                in: auxTechnicals.map(technical => technical.id)
              }
            },
            data: {
              title: null
            }
          });
        }

        // update auxiliaries status to false
        await prisma.visor_Auxiliaries.updateMany({
          where: {
            id: {
              in: auxiliaries.map(aux => aux.id)
            }
          },
          data: {
            active: false
          }
        });
      }

      // update title to user of subcoordination to null and status to false
      await prisma.visor_SubCoordinator.update({
        where: { id: subcoordinator.id },
        data: {
          User: {
            update: {
              title: null
            }
          },
          Technical: {
            update: {
              title: null
            }
          },
          active: false
        }
      });
    }

    // update coordinator status and user titles
    const updateResult = await prisma.visor_structureCoordinator.update({
      where: { id },
      data: {
        active: false,
        Attach: {
          update: {
            title: null
          }
        },
        Technical: {
          update: {
            title: null
          }
        },
        VisorUser: {
          update: {
            title: null
          }
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "Coordinator deleted successfully", data: updateResult });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

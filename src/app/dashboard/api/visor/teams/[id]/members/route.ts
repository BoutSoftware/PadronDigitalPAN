import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

// Get team members
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    // Verify if team exists
    const teamExists = await prisma.visor_Team.findFirst({
      where: { id, active: true },
      include: {
        Auxiliary: {
          include: {
            User: {
              include: {
                User: {
                  include: {
                    Person: true
                  }
                }
              }
            }
          }
        },
        Link: {
          include: {
            User: {
              include: {
                Person: true
              }
            }
          }
        },
        Caminantes: {
          where: {
            active: true
          },
          include: {
            User: {
              include: {
                User: {
                  include: {
                    Person: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!teamExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Team not found" });
    }

    const data: {
      members: {
        id: string;
        name: string;
        active: boolean;
      }[];
      auxiliary: {
        id: string;
        name: string;
        active: boolean;
      };
      link: {
        id: string;
        name: string;
        active: boolean;
      }
    } = {
      members: [],
      auxiliary: {
        id: "",
        name: "",
        active: false
      },
      link: {
        id: "",
        name: "",
        active: false
      }
    };

    const auxiliaryPerson = teamExists.Auxiliary.User.User.Person;
    const linkPerson = teamExists.Link.User.Person;
    const caminantes = teamExists.Caminantes;

    data.auxiliary = {
      id: teamExists.auxiliaryId,
      name: `${auxiliaryPerson.name} ${auxiliaryPerson.fatherLastName} ${auxiliaryPerson.motherLastName}`,
      active: teamExists.Auxiliary.active
    };

    data.link = {
      id: teamExists.linkId,
      name: `${linkPerson.name} ${linkPerson.fatherLastName} ${linkPerson.motherLastName}`,
      active: teamExists.Link.active
    };

    caminantes.forEach(caminante => {
      const caminantePerson = caminante.User.User.Person;
      data.members.push({
        id: caminante.id,
        name: `${caminantePerson.name} ${caminantePerson.fatherLastName} ${caminantePerson.motherLastName}`,
        active: caminante.active
      });
    });

    return NextResponse.json({ code: "OK", message: "Members retrieved successfully", data: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
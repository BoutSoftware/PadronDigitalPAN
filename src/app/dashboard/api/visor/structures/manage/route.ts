import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { hasIncompleteFields } from "@/utils";
import { Visor_Structure } from "@prisma/client";

// Ejemplo de como acceder a la ruta POST de la API: http://localhost:3020/dashboard/api/visor/structures/manage
export async function POST(request: NextRequest) {
  try {

    const { id, coordinatorId, technicalId, auditorId } = await request.json() as Visor_Structure;

    if (hasIncompleteFields({ id, coordinatorId, technicalId, auditorId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    if (technicalId === auditorId) {
      return NextResponse.json({ code: "BAD_FIELDS", message: "technicalId and auditorId cannot be the same" });
    }

    console.log({ id, coordinatorId, technicalId, auditorId });


    const structure = await prisma.visor_Structure.update({
      where: { id },
      data: {
        // coordinatorId
        // technicalId,
        // auditorId,
        Coordinator: {
          connect: {
            id: coordinatorId as string,
          },
          update: {
            title: "Coordinador de activacion"
          }
        },
        Technical: {
          connect: {
            id: technicalId as string,
          },
          update: {
            title: "Técnico de activacion"
          }
        },
        Auditor: {
          connect: {
            id: auditorId as string,
          },
          update: {
            title: "Auditor de activacion"
          }
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "Structure updated", data: structure });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export async function PATCH(request: NextRequest) {
  try {

    const { id, coordinatorId, technicalId, auditorId } = await request.json() as Visor_Structure;

    if (hasIncompleteFields({ coordinatorId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    // Verify if technicalId is the same as auditorId
    if (technicalId === auditorId && (technicalId !== undefined || technicalId !== null)) {
      return NextResponse.json({ code: "BAD_FIELDS", message: "technicalId and auditorId cannot be the same" });
    }

    // Check if id is currently the id of the structure of the coordinator
    const structure = await prisma.visor_Structure.findFirst({ where: { coordinatorId: coordinatorId as string } });

    console.log({ structure, id });


    if (structure?.id !== id) {
      // Structure changed
      // Remove the fields of the old structure
      console.log("Structure is changed, removing fields");

      await prisma.visor_Structure.update({
        where: { id: structure?.id },
        data: {
          Coordinator: {
            update: {
              title: "Sin titulo",
            },
            disconnect: true
          },
          Technical: {
            update: {
              title: "Sin titulo"
            },
          },
          Auditor: {
            update: {
              title: "Sin titulo"
            },
          }
        }
      });

      // await prisma.visor_Structure.update({
      //   where: { id: structure?.id },
      //   data: {
      //     Coordinator: {
      //       disconnect: true
      //     },
      //     Technical: {
      //       disconnect: true
      //     },
      //     Auditor: {
      //       disconnect: true
      //     }
      //   }
      // });
    }

    const structureUpdated = await prisma.visor_Structure.update({
      where: { id },
      data: {
        Coordinator: {
          connect: {
            id: coordinatorId as string,
          },
          update: {
            title: "Coordinador de activacion"
          }
        },
        ...(technicalId && {
          Technical: {
            connect: {
              id: technicalId as string,
            },
            update: {
              title: "Técnico de activacion"
            }
          }
        }),
        ...(auditorId && {
          Auditor: {
            connect: {
              id: auditorId as string,
            },
            update: {
              title: "Auditor de activacion"
            }
          }
        })
      }
    });


    return NextResponse.json({ code: "OK", message: "Structure updated", data: structureUpdated });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }

}


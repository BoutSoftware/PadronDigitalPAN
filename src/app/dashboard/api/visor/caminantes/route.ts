import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

// Get caminantes without team if team could be null
// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const team = searchParams.get("team");

//     const caminantes = await prisma.visor_Caminantes.findMany({
//       where: {
//         Team: team === "false" ? null : team === "true" ? { id: { not: undefined } } : undefined
//       },
//       select: {
//         id: true,
//         active: true,
//         userId: true,
//         User: {
//           select: {
//             User: {
//               select: {
//                 Person: {
//                   select: {
//                     name: true,
//                     fatherLastName: true,
//                     motherLastName: true
//                   }
//                 }
//               }
            
//             }
//           }
//         }
//       }
//     });

//     if (!caminantes.length) {
//       return NextResponse.json({ code: "NOT_FOUND", message: "No caminantes found" });
//     }

//     return NextResponse.json({ code: "OK", message: "Caminantes retrieved successfully", data: caminantes });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ code: "ERROR", message: "An error occurred" });
//   }
// }

// Get caminantes without team (visor users with rol User)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const team = searchParams.get("team");

    const caminantes = await prisma.visor_User.findMany({
      where: {
        rol: "User",
        ...(team === "false" && {
          // Caminantes: { none: {} },
          // Links: { none: {} }
          title: null
        }),
        ...(team === "true" && {
          OR: [
            { Caminantes: { some: {} } },
            { Links: { some: {} } }
          ]
        })
      },
      select: {
        id: true,
        active: true,
        userId: true,
        title: true,
        rol: true,
        User: {
          select: {
            Person: {
              select: {
                name: true,
                fatherLastName: true,
                motherLastName: true,
              }
            }
          }
        }
      }
    });

    if (!caminantes.length) {
      return NextResponse.json({ code: "NOT_FOUND", message: "No caminantes found" });
    }

    return NextResponse.json({ code: "OK", message: "Caminantes retrieved successfully", data: caminantes });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}


import prisma from "@/configs/database";
import { NextResponse } from "next/server";

// Get visor users
export async function GET() {
  try {
    const users = await prisma.visor_User.findMany({
      select: {
        id: true,
        rol: true,
        active: true,
        title: true,
        User: {
          select: {
            Person: {
              select: {
                name: true,
                fatherLastName: true,
                motherLastName: true,
                photoURL: true
              }
            }
          }
        }
      },
    });

    if (!users.length) {
      return NextResponse.json({ code: "NOT_FOUND", message: "No users found" });
    }

    type AccType = {
      [key: string]: unknown[];
    };

    const usersByRol = users.reduce((acc: AccType, user) => {
      const rol = user.rol ? `${user.rol}s` : "Without Rol";
      if (!acc[rol]) {
        acc[rol] = [];
      }
      acc[rol].push(user);
      return acc;
    }, {} as AccType);

    return NextResponse.json({ code: "OK", message: "Users retrieved successfully", data: usersByRol });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}
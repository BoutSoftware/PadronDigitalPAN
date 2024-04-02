import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";
import { nAccesses } from ".."; 

export async function GET(request: NextRequest) {
  request.headers.has("Authorization");
  try {

    const defaultElements = 15;

    const pagination = request.nextUrl.searchParams.get("pagination");

    interface Pagination {
        page?: number | undefined;
        elements?: number | undefined;
    }
    
    const { page, elements }: Pagination = pagination ? JSON.parse(decodeURI(pagination)) : {};
    

    interface userList {
      id: string;
      username: string;
      active: boolean;
      activemodules?: number;
      roles: {
        visor: string | null;
        whats: string | null;
      };
      Person: {
        name: string;
        fatherLastName: string;
        motherLastName: string | null;
        email: string | null;
      };
    }[];

    const data: userList[] = await prisma.user.findMany({
      skip: ( page ? page - 1 : 0 ) * (elements || defaultElements),
      take: elements || defaultElements,
      select: {
        id: true,
        roles: true,
        active: true,
        username: true,
        Person: {
          select: {
            name: true,
            fatherLastName: true,
            motherLastName: true,
            email: true,
          },
        },
      },
    });

    data.forEach(element => {
      element.activemodules = nAccesses(element.roles);
    });

    return NextResponse.json({ code: "OK", message: "Usuarios sacados con exito", data: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

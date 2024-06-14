import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Street } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    
    const streets = await prisma.street.findMany({
    // TODO: If we also want the name of the colony, we can unccoment the following code.
    //   include: {
    //     Colonia: {
    //       select: {
    //         name: true,
    //       }
    //     }
    //   }
    });

    if (!streets) return NextResponse.json({ code: "NOT_FOUND", message: "No streets found" });

    return NextResponse.json({ code: "OK", message: "Streets retrieved succesfully", data: streets });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}

export async function POST(request: NextRequest) {
  try {
    
    const { name, coloniaId } = (await request.json()) as (Street);

    if (hasIncompleteFields({ name, coloniaId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const street = await prisma.street.create({
      data: {
        name,
        coloniaId
      }
    });

    return NextResponse.json({ code: "OK", message: "Street created succesfully", data: street });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}
import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Municipio } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {

    const { name } = (await request.json()) as (Municipio);

    if (hasIncompleteFields({ name })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const municipio = await prisma.municipio.create({
      data: {
        name
      }
    });



    return NextResponse.json({ code: "OK", message: "Municipio created succesfully", data: municipio });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}

// Example POST request: http://localhost:3020/dashboard/api/directory/municipios/test

// Example Body: 
// {
//   name: "Municipio Test"
// }
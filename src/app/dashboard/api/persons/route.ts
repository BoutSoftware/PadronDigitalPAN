import { NextRequest, NextResponse } from "next/server";
import prisma from "@/configs/database";
import { removeAccents } from "@/utils";
import { Person } from "@prisma/client";

// Ejemplo de como acceder a la ruta GET de la API: http://localhost:3000/api/persons?name=[name]
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = removeAccents(searchParams.get("name") || "");

  // Validate params
  // if (!name || typeof name !== "string") {
  //   return new Response("Bad Request", { status: 400 });
  // }

  // separate name by spaces
  const nameParts = name.split(" ");

  // Search for persons 
  const persons = await prisma.person.findMany({
    where: {
      AND:
        nameParts.map(namePart => ({
          OR: [
            { name: { contains: namePart, mode: "insensitive" } },
            { fatherLastName: { contains: namePart, mode: "insensitive" } },
            { motherLastName: { contains: namePart, mode: "insensitive" } }
          ]
        }))
    }
  });

  // if no persons found 
  if (!persons.length) {
    return NextResponse.json({ code: "NOT_FOUND", message: "No persons found" });
  }

  return NextResponse.json({ code: "OK", message: "Persons retrieved successfully", data: persons });
}

export async function POST(request: NextRequest) {
  try {
    const { name, fatherLastName, email } = (await request.json()) as Person;

    const person = await prisma.person.create({
      data: {
        name,
        fatherLastName,
        email
      },
    });

    return NextResponse.json({ code: "OK", message: "Person created successfully", data: person });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/configs/database";
import { Person } from "@/configs/interfaces";

// Ejemplo de como acceder a la ruta GET de la API: http://localhost:3000/api/persons?name=[name]
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");

  // Validate params
  if (!name || typeof name !== "string") {
    return new Response("Bad Request", { status: 400 });
  }

  let persons: Person[] = [];

  // verify if name contains spaces
  if (name.includes(" ")) {
    // separate name by spaces
    const nameParts = name.split(" ");

    // Search for persons if name contains spaces
    for (const namePart of nameParts) {
      const personsName = await prisma.person.findMany({
        where: {
          OR: [
            { name: { contains: namePart, mode: "insensitive" } },
            { fatherLastName: { contains: namePart, mode: "insensitive" } },
            { motherLastName: { contains: namePart, mode: "insensitive" } },
          ]
        }
      });

      personsName.forEach(person => {
        // if person is already in the array do not add it
        if (!persons.some(p => p.id === person.id)) {
          persons.push(person);
        }
      });
    }
  }

  // Search for persons if name does not contain spaces
  if (!name.includes(" ")) {
    persons = await prisma.person.findMany({
      where: {
        OR: [
          { name: { contains: name, mode: "insensitive" } },
          { fatherLastName: { contains: name, mode: "insensitive" } },
          { motherLastName: { contains: name, mode: "insensitive" } }
        ]
      }
    });
  }

  // if no persons found 
  if (!persons.length) {
    return NextResponse.json({ code: "NOT_FOUND", message: "No persons found" });
  }

  return NextResponse.json({ code: "OK", message: "Persons retrieved successfully", data: persons });
}

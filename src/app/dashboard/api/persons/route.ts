import { NextRequest, NextResponse } from "next/server";
import prisma from "@/configs/database";
import { removeAccents } from "@/utils";

// Ejemplo de como acceder a la ruta GET de la API: http://localhost:3000/api/persons?name=[name]
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = removeAccents(searchParams.get("name") || "") || null;
  const user = searchParams.get("user");

  try {
    // Validate params
    // if (!name || typeof name !== "string") {
    //   return new Response("Bad Request", { status: 400 });
    // }

    // separate name by spaces
    const nameParts = (name ?? "").split(" ");

    // Search for persons 
    const persons = await prisma.person.findMany({
      where: {
        // if user is false, search for persons that are not users
        User: user === "false" ? null : user === "true" ? { id: { not: undefined } } : undefined,
        AND: nameParts.map(namePart => ({
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
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

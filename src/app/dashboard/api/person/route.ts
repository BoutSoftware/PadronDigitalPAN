import prisma from "@/configs/database";
import { Person } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({ code: "OK", message: "Person created successfully", data: person});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

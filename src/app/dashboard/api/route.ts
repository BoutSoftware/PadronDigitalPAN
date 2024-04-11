import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  request.headers.has("Authorization");

  // const personaResult = await prisma.person.create({
  //   data: {
  //     name: "Javier",
  //     email: "javier@gmail.com",
  //     phone: {
  //       isActive: true,
  //       number: "1234567890",
  //     },
  //     fatherLastName: "Zamudio",
  //     motherLastName: "García",
  //   }
  // });

  // console.log(personaResult);

  return NextResponse.json({ message: "Welcome to the Dashboard API" });
}
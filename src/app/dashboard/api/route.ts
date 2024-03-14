import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  request.headers.has("Authorization");

  // const personaResult = await prisma.person.create({
  //   data: {
  //     name: "Javier",
  //     email: "javier@gmail.com",
  //     phone: "1234567890",
  //     fatherLastName: "Zamudio",
  //     motherLastName: "García",
  //   }
  // });


  // await prisma.user.create({
  //   data: {
  //     personId: personaResult.id,
  //     isSuperAdmin: true,
  //     username: "javier",
  //     password: "javier",
  //     modules: {
  //       set: undefined
  //     }
  //   }
  // });



  return NextResponse.json({ message: "Welcome to the Dashboard API" });
}
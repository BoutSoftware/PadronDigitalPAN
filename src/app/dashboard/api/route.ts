// import prisma from "@/configs/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  request.headers.has("Authorization");

  // await prisma.user.create({
  //   data: {
  //     personId: "65f14e5e8e99bfd28b0e963c",
  //     isSuperAdmin: false,
  //     username: "juanPablo",
  //     password: "juanPablo",
  //   }
  // });

  return NextResponse.json({ message: "Welcome to the Dashboard API" });
}
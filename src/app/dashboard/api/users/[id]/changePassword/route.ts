import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    interface ReqBody { username: string, password: string; }

    const { username, password } = await request.json() as ReqBody;

    if (hasIncompleteFields({ username, password })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Password is missing" });
    }

    const userExists = await prisma.user.findUnique({ where: { username: username } });
    if (!userExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "User doesn't exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: {
        username: username,
      },
      data: {
        password: hashedPassword
      }
    });

    return NextResponse.json({ code: "OK", message: "Password updated succesfully", data: user});
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}

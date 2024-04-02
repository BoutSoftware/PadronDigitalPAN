import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest, { params } : { params: { id: string } }) {
  try {

    interface ReqBody { password: string; }

    const id = params.id;
    const { password } = await request.json() as ReqBody;

    if (hasIncompleteFields({ password })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Password is missing" });
    }

    const userExists = await prisma.user.findUnique({ where: { id: id } });
    if (!userExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "User doesn't exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        password: true
      }
    });

    return NextResponse.json({ code: "OK", message: "Password updated succesfully", data: user});
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}

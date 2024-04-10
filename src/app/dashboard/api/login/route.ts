import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jtw, { sign } from "jsonwebtoken";
import { JWT_SECRET } from "@/configs";
import { parseUserRoles } from "../users";

export async function POST(request: NextRequest) {
  interface ReqBody { username: string, password: string }

  const reqBody = await request.json() as ReqBody;
  const { username, password } = reqBody;

  if (hasIncompleteFields({ username, password })) {
    return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username }, include: { Person: true } });

    // Verify if user exists
    if (!user) {
      return NextResponse.json({ code: "USER_NOT_FOUND", message: "User not found" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ code: "INVALID_PASSWORD", message: "Invalid password" });
    }

    // Generate a JSON Web Token
    const token = sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    const data = { token, name: user.Person.name };

    return NextResponse.json({ code: "OK", message: "Login successful", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "INTERNAL_SERVER_ERROR", message: "An error occurred" });
  }
}

export async function GET(request: NextRequest) {
  try {

    const token: string = request.nextUrl.searchParams.get("token") || "";

    if ((token === "")) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Token is missing" });
    }

    const decodedToken = jtw.verify(token, JWT_SECRET) as { username: string; id: string } || Boolean;

    const data = await prisma.user.findFirst({
      where: {
        id: decodedToken.id,
      },
      select: {
        id: true,
        username: true,
        roles: true,
        isSuperAdmin: true,
        Person: {
          select: {
            name: true,
          }
        }
      }
    });

    if (!data) {
      return NextResponse.json({ code: "USER_NOT_FOUND", message: "User missing" });
    }

    return NextResponse.json({ code: "OK", message: "Token is valid", data: { ...data, roles: parseUserRoles(data?.roles, data?.isSuperAdmin) } });

  } catch (error) {
    return NextResponse.json({ code: "ERROR", message: "An error ocurred." });
  }

}
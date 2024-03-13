import prisma from "@/configs/database";
import { hasIncompleteFields, sleep } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { personId, username, password } = reqBody;

  if (hasIncompleteFields({ personId, username, password })) {
    return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
  }

  const user = await prisma.user.create({
    data: {
      personId: personId,
      isSuperAdmin: false,
      username: username,
      password: password,
    }
  });

  return NextResponse.json({ code: "OK", message: "User created successfully", data: user });
}

export async function GET(request: NextRequest) {
  await sleep(1000);

  request.headers.has("Authorization");

  const users = await prisma.user.findMany({
    include: {
      Roles: {
        include: {
          Module: true
        }
      }
    }
  });

  const modules = await prisma.module.findMany();

  const usersWithRoles = users.map((user) => {
    const roles = {} as { [key: string]: string };

    user.Roles.forEach((role) => {
      roles[role.Module.key] = role.name;
    });

    if (user.isSuperAdmin) {
      roles["sup"] = "SuperAdmin";

      modules.forEach((module) => {
        roles[module.key] = "SuperAdmin";
      });
    }

    return {
      ...user,
      Roles: undefined,
      roles
    };
  });

  return NextResponse.json({ code: "OK", message: "Users fetched successfully", data: usersWithRoles });
}
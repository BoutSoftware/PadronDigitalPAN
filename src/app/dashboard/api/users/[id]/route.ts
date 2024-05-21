import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { parseUserRoles, nAccesses } from "..";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (hasIncompleteFields({ id })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const user = await prisma.user.findFirst({
      where: {
        id
      },
      include: {
        Person: true,
      }
    });

    if (!user) {
      return NextResponse.json({ code: "NOT_FOUND", message: "User not found" });
    }

    const data = {
      ...user,
      password: undefined,
      activeModules: nAccesses(user.roles),
      roles: parseUserRoles(user.roles, user.isSuperAdmin),
    };

    return NextResponse.json({ code: "OK", message: "User retrived succesfully", data: data });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "OK", message: "An error occurred" });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (hasIncompleteFields({ id })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const user = await prisma.user.findFirst({
      where: {
        id
      }
    });

    if (!user) {
      return NextResponse.json({ code: "NOT_FOUND", message: "User not found" });
    }

    // update user state
    await prisma.user.update({
      where: {
        id
      },
      data: {
        active: false
      }
    });

    const data = {
      ...user,
      password: undefined,
    };

    return NextResponse.json({ code: "OK", message: "User deleted succesfully", data: data });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

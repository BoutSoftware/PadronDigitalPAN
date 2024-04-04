import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { UserRoles } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  interface ReqBody { roles: UserRoles; }

  const reqBody = await request.json() as ReqBody;
  const { roles } = reqBody;
  const id = params.id;

  // Check if some fields are missing
  if (hasIncompleteFields({ roles })) {
    return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ code: "USER_NOT_FOUND", message: "User not found" });
    }

    // Get allowed roles
    const allowedRoles = Object.keys(user.roles) as (keyof UserRoles)[];
    // Check if roles are valid
    const invalidRoles = Object.keys(roles).filter(role => !allowedRoles.includes(role as keyof UserRoles));
    if (invalidRoles.length) {
      return NextResponse.json({ code: "INVALID_ROLES", message: "Invalid roles", data: invalidRoles });
    }

    // Get allowed roles values
    const allowedRolesValues = allowedRoles.map(role => user.roles[role]);
    // Check if roles are valid
    const invalidRolesValues = Object.entries(roles).filter(([, value]) => !allowedRolesValues.includes(value));

    if (invalidRolesValues.length) {
      return NextResponse.json({ code: "INVALID_ROLES_VALUES", message: "Invalid roles values", data: invalidRolesValues });
    }

    // Update user roles
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        roles: {
          visor: roles.visor,
          whats: roles.whats,
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "User updated successfully", data: updatedUser.roles });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
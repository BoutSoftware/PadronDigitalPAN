import prisma from "@/configs/database";
import { ModuleName, VisorRole, WhatsRole, modulesList } from "@/configs/roles";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  interface ReqBody { module: string, role: string }

  const reqBody = await request.json() as ReqBody;
  const { module, role } = reqBody;
  const id = params.id;

  // Check if some fields are missing
  if (hasIncompleteFields({ module, role })) {
    return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ code: "USER_NOT_FOUND", message: "User not found" });
    }

    // check if the module exists in ModuleList
    const allowedModules = modulesList.map(m => m.id);
    if (!allowedModules.includes(module as ModuleName)) {
      return NextResponse.json({ code: "INVALID_MODULE", message: "Invalid module" });
    }

    // check if the role exists in the module
    const allowedRoles = modulesList.find(m => m.id === module)?.roles;
    if (!allowedRoles?.includes(role as VisorRole | WhatsRole)) {
      return NextResponse.json({ code: "INVALID_ROLE", message: "Invalid role" });
    }

    // Update user roles
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        roles: {
          // if the module already exists, update the role
          // otherwise, add the module and role
          set: user.roles.find(r => r.module === module) ?
            user.roles.map(r => r.module === module ? { module, role } : r) :
            [...user.roles, { module, role }]
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "User updated successfully", data: updatedUser.roles });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
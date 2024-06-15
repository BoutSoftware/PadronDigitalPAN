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
  if (hasIncompleteFields({ module })) {
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

    // if module is "visor" create a visor_user
    let visorUserCreated;
    let visorUserUpdated;

    if (module === "visor" as ModuleName) {
      // Check if user already has a visor user
      const visorUser = await prisma.visor_User.findFirst({ where: { userId: id } });
      if (visorUser) {
        visorUserUpdated = await prisma.visor_User.update({
          where: { id: visorUser.id },
          data: {
            rol: role as VisorRole,
            active: role !== null,
            title: role === "Admin" ? "Administrador" : null
          }
        });
      } else {
        // Create visor user
        visorUserCreated = await prisma.visor_User.create({
          data: {
            userId: id,
            rol: role as VisorRole,
            title: role === "Admin" ? "Administrador" : undefined
          }
        });
      }
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

    const data = {
      visorUser: visorUserCreated || visorUserUpdated,
      updatedUser: updatedUser.roles
    };

    return NextResponse.json({ code: "OK", message: "User updated successfully", data: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
import prisma from "@/configs/database";
import { ModuleId, TerritorialRole, WhatsRole, modulesList } from "@/configs/roles";
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
    if (!allowedModules.includes(module as ModuleId)) {
      return NextResponse.json({ code: "INVALID_MODULE", message: "Invalid module" });
    }

    // check if the role exists in the module
    const allowedRoles = modulesList.find(m => m.id === module)?.roles;
    if (!allowedRoles?.includes(role as TerritorialRole | WhatsRole)) {
      return NextResponse.json({ code: "INVALID_ROLE", message: "Invalid role" });
    }

    // Data to return to front
    const data: {
      visorUser?: {
        id: string;
        createdAt: Date;
        active: boolean;
        userId: string;
        title: string | null;
        rol: string | null;
      }

      updatedUser: {
        module: string;
        role: string | null;
      }[];
    } = {
      visorUser: undefined,
      updatedUser: []
    };

    if (module === "visor" as ModuleId) {
      // Get current visor User (if exists)
      const visorUser = await prisma.visor_User.findFirst({ where: { userId: id } });

      if (visorUser) {
        // Update Visor user
        data.visorUser = await prisma.visor_User.update({
          where: { id: visorUser.id },
          data: {
            rol: role as TerritorialRole,
            active: role !== null,
            title: role === "Admin" ? "Administrador" : null
          }
        });
      } else {
        // Create visor user
        data.visorUser = await prisma.visor_User.create({
          data: {
            userId: id,
            rol: role as TerritorialRole,
            title: role === "Admin" ? "Administrador" : null
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

    data.updatedUser = updatedUser.roles;

    return NextResponse.json({ code: "OK", message: "User updated successfully", data: data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
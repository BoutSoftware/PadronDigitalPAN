import prisma from "@/configs/database";
import { NextResponse } from "next/server";

// Get visor users
export async function GET() {
  try {
    const visorAdmins = await prisma.visor_User.findMany({
      where: { rol: "Admin", active: true },
    });

    const structureCoordinators = await prisma.visor_structureCoordinator.findMany({
      where: { active: true },
      include: { VisorUser: true }
    });

    const subCoordinators = await prisma.visor_SubCoordinator.findMany({
      where: { active: true },
      include: { User: true }
    });

    const auxiliaries = await prisma.visor_Auxiliaries.findMany({
      where: { active: true },
      include: { User: true }
    });

    const users = await prisma.visor_User.findMany({
      where: { active: true, rol: "User" },
    });

    const data = {
      admins: visorAdmins,
      structureCoordinators: structureCoordinators,
      subCoordinators: subCoordinators,
      auxiliaries,
      users
    };

    return NextResponse.json({ code: "OK", message: "Users retrieved successfully", data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}
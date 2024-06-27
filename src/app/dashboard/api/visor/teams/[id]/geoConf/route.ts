import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

// Udate geographic configuration

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  interface reqBody {
    geographicLevel?: string;
    values: string[];
  }

  try {
    const { geographicLevel, values } = await request.json() as reqBody;
    const id = params.id;

    if (hasIncompleteFields({ values })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    // Verify if team exists
    const teamExists = await prisma.visor_Team.findFirst({ where: { id } });
    if (!teamExists) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Team not found" });
    }

    const teamUpdated = await prisma.visor_Team.update({
      where: { id },
      data: {
        // if geographicLevel is undefined update only values, and if is not replace all object geographicConf
        geographicConf: geographicLevel ? { geographicLevel, values } : {
          ...teamExists.geographicConf,
          values
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "Team updated successfully", data: teamUpdated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
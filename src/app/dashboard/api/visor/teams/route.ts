import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Visor_Team } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, geographicConf, linkId, auxiliaryId, pointTypesIDs } = (await request.json()) as Visor_Team;

    if (hasIncompleteFields({ name, geographicConf, linkId })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const team = await prisma.visor_Team.create({
      data: {
        name,
        geographicConf,
        linkId,
        auxiliaryId,
        pointTypesIDs
      }
    });

    return NextResponse.json({ code: "OK", message: "Team created succesfully", data: team });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}
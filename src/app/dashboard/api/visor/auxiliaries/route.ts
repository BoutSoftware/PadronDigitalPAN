import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Visor_Auxiliaries } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {userId, technicalId, active, subCoordinator, municipiosIDs} = await request.json() as Visor_Auxiliaries;

    if (hasIncompleteFields({userId, technicalId, subCoordinator})) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }
    
    const axuliar = await prisma.visor_Auxiliaries.create({
      data: {
        userId,
        technicalId,
        active,
        subCoordinator,
        municipiosIDs
      }
    });

    return NextResponse.json({ code: "OK", message: "Auxiliary created", data: axuliar });

    // Example body data for POST request:
    // {
    //   userId: "1",
    //   technicalId: "2",
    //   active: true,
    //   subCoordinator: "3",
    //   municipiosIDs: ["4", "5"]
    // }

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
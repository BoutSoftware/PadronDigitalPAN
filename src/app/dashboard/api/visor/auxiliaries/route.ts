import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Visor_Auxiliaries } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const estructura = searchParams.get("estructura") as string;

    if (!estructura) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const auxiliaries = await prisma.visor_Auxiliaries.findMany({
      where: {
        SubCoordinator: {
          structureId: estructura
        }
      }
    });

    return NextResponse.json({ code: "OK", message: "Auxiliaries found", data: auxiliaries });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
    
  }
  
}


export async function POST(request: NextRequest) {
  try {
    const {userId, technicalId, subCoordinator, municipiosIDs} = await request.json() as Visor_Auxiliaries;

    if (hasIncompleteFields({userId, technicalId, subCoordinator})) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }
    
    const axuliar = await prisma.visor_Auxiliaries.create({
      data: {
        userId,
        technicalId,
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
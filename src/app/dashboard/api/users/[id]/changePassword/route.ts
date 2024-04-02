import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    interface ReqBody { id: string, password: string; }

    const { id, password } = await request.json() as ReqBody;

    if (hasIncompleteFields({ id, password })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Password is missing" });
    }


    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }
}

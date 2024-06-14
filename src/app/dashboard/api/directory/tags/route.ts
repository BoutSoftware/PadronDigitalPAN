import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { Tag } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {

    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            Persons: true,
          }
        }
      },
    });

    if (!tags.length) {
      return NextResponse.json({ code: "NOT_FOUND", message: "No tags found" });
    }

    return NextResponse.json({ code: "OK", message: "Tags retrieved succesfully", data: tags });


  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });

  }
}

export async function POST(request: NextRequest) {
  try {

    const { name } = (await request.json()) as (Tag);

    if (hasIncompleteFields({ name })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const tag = await prisma.tag.create({
      data: {
        name
      }
    });

    return NextResponse.json({ code: "OK", message: "Tag created succesfully", data: tag });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error ocurred" });
  }

}
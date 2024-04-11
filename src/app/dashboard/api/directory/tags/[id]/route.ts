import prisma from "@/configs/database";
import { Tag } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string }}) {
  try {

    const id = params.id;
    const tag = await prisma.tag.findUnique({ where: { id }});

    if (!tag) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Tag not found" });
    }

    // TODO: In here, we could also send the amount of ids tied to the tag 
    return NextResponse.json({ code: "OK", message: "Tag retrieved succesfully", data: tag});

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  } 
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string }}) {
  try {

    const id = params.id;
    const { name} = (await request.json() as Tag);

    const updatedTag = await prisma.tag.updateMany({
      where: { id },
      data: {
        name
      }
    });

    if ( updatedTag.count === 0 ) return NextResponse.json({ code: "NOT_FOUND", message: "Tag not found" });

    return NextResponse.json({ code: "OK", message: "Tag updated succesfully", data: updatedTag });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }   
}

export async function DELETE(request: NextRequest, { params }: { params: {id: string}}) {
  try {
    
    const id = params.id;

    const tag = await prisma.tag.findUnique({ where: { id }});
    if (!tag) return NextResponse.json({ code: "NOT_FOUND", message: "Tag not found"});

    await prisma.tag.delete({ where: { id }});

    return NextResponse.json({ code: "OK", message: "Tag deleted succesfully"});
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
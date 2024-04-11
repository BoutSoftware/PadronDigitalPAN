import prisma from "@/configs/database";
import { Street } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: {id: string}}) {
  try {
    
    const id = params.id;
    const street = await prisma.street.findUnique({ 
      where: {id},
    //   TODO: If we also want the colony name, uncomment the following code
    //   include: {
    //     Colonia: {
    //       select: {
    //         name: true,
    //       }
    //     }
    //   }
    });

    if (!street) return NextResponse.json({ code: "NOT_FOUND", message: "Street not found" });

    return NextResponse.json({ code: "OK", message: "Street retrived successfully", data: street});

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }  
}

export async function PATCH(request: NextRequest, { params }: { params: {id: string}}) {
  try {

    const id = params.id;
    const { name, coloniaId } = await request.json() as Street;

    const updatedStreet = await prisma.street.updateMany({
      where: { id },
      data: {
        name,
        coloniaId,
      },
    });

    if ( updatedStreet.count === 0 ) return NextResponse.json({ code: "NOT_FOUND", message: "Street not found" });
    
    return NextResponse.json({ code: "OK", message: "Street updated succesfully", data: updatedStreet });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: {id: string}}) {
  try {

    const id = params.id;

    const street = await prisma.street.findUnique({ where: { id }});
    if (!street) return NextResponse.json({ code: "NOT_FOUND", message: "Tag not found"});

    await prisma.street.delete({ where: { id }});

    return NextResponse.json({ code: "OK", message: "Street deleted succesfully"});
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }  
}
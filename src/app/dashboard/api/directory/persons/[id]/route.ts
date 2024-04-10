import { NextRequest, NextResponse } from "next/server";
import prisma from "@/configs/database";
import { Person } from "@prisma/client";

// Get a person by id
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const person = await prisma.person.findUnique({ where: { id } });

    if (!person) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Person not found" });
    }

    return NextResponse.json({ code: "OK", message: "Person retrieved successfully", data: person });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

// Update a person by id
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { name, fatherLastName, motherLastName, birthPlace, email, curp, gender, phone, profession,
    rfc, scholarship, tagIDs, voterKey } = (await request.json()) as Person;

  try {
    // check if person exists
    const person = await prisma.person.findUnique({ where: { id } });
    if (!person) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Person not found" });
    }

    // update person
    const updatedPerson = await prisma.person.update({
      where: { id },
      data: {
        name,
        fatherLastName,
        motherLastName,
        email,
        birthPlace,
        curp,
        rfc,
        phone,
        profession,
        gender,
        scholarship,
        tagIDs,
        voterKey
      },
    });
    return NextResponse.json({ code: "OK", message: "Person updated successfully", data: updatedPerson });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

// Delete a person by id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    // check if person exists
    const person = await prisma.person.findUnique({ where: { id } });
    if (!person) {
      return NextResponse.json({ code: "NOT_FOUND", message: "Person not found" });
    }

    // delete person
    await prisma.person.delete({ where: { id } });
    return NextResponse.json({ code: "OK", message: "Person deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/configs/database";
import { hasIncompleteFields, removeAccents } from "@/utils";
import { Address, PendingAddress, Person } from "@prisma/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = removeAccents(searchParams.get("name") || "") || null;
  const user = searchParams.get("user");

  try {
    // Validate params
    // if (!name || typeof name !== "string") {
    //   return new Response("Bad Request", { status: 400 });
    // }

    // separate name by spaces
    const nameParts = (name ?? "").split(" ");

    // Search for persons 
    const persons = await prisma.person.findMany({
      where: {
        // if user is false, search for persons that are not users
        User: user === "false" ? null : user === "true" ? { id: { not: undefined } } : undefined,
        AND: nameParts.map(namePart => ({
          OR: [
            { name: { contains: namePart, mode: "insensitive" } },
            { fatherLastName: { contains: namePart, mode: "insensitive" } },
            { motherLastName: { contains: namePart, mode: "insensitive" } }
          ]
        }))
      }
    });

    // if no persons found 
    if (!persons.length) {
      return NextResponse.json({ code: "NOT_FOUND", message: "No persons found" });
    }

    return NextResponse.json({ code: "OK", message: "Persons retrieved successfully", data: persons });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, fatherLastName, motherLastName, birthPlace, email, curp, gender, phone, profession,
      rfc, scholarship, tagIDs, voterKey, address } = (await request.json()) as (Person & { phone: string | null, address?: (Address & { pendingAddress?: PendingAddress }) });

    // check for missing fields
    if (hasIncompleteFields({ name, fatherLastName })) {
      return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
    }

    const duplicates = await prisma.person.findMany({
      where: {
        OR: [
          { curp: curp || undefined },
          { email: email || undefined },
          { rfc: rfc || undefined },
          { voterKey: voterKey || undefined }
        ]
      }
    });

    // TODO: Enabled duplicates validation (remove !duplicates.length condition)
    if (duplicates.length && !duplicates.length) {
      // validate curp
      if (curp && duplicates.find(d => d.curp === curp)) {
        return NextResponse.json({ code: "DUPLICATE_CURP", message: "CURP already exists" });
      }

      // validate email
      if (email && duplicates.find(d => d.email === email)) {
        return NextResponse.json({ code: "DUPLICATE_EMAIL", message: "Email already exists" });
      }

      // validate rfc
      if (rfc && duplicates.find(d => d.rfc === rfc)) {
        return NextResponse.json({ code: "DUPLICATE_RFC", message: "RFC already exists" });
      }

      // validate voterKey
      if (voterKey && duplicates.find(d => d.voterKey === voterKey)) {
        return NextResponse.json({ code: "DUPLICATE_VOTERKEY", message: "Voter Key already exists" });
      }
    }

    // validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ code: "INVALID_EMAIL", message: "Invalid email format" });
    }

    const person = await prisma.person.create({
      data: {
        name,
        fatherLastName,
        motherLastName,
        email,
        birthPlace,
        curp,
        rfc,
        phone: phone ? { number: phone } : null,
        profession,
        scholarship,
        gender,
        voterKey,
        tagIDs
      }
    });

    // create user Address
    if (address) {
      const personAddress = await prisma.address.create({
        data: {
          complementId: address.complementId,
          defComplement: address.defComplement,
          electoralSectionId: address.electoralSectionId,
          interiorNum: address.interiorNum,
          isEstablished: address.isEstablished,
          outdoorNum: address.outdoorNum,
          streetId: address.streetId,
          foreignAddress: address.foreignAddress,
          personId: person.id,
        }
      });

      // if address in not established create a pendingAddress
      if (!address.isEstablished) {
        if (address.pendingAddress) {
          await prisma.pendingAddress.create({
            data: {
              addressId: personAddress.id,
              colonia: address.pendingAddress.colonia,
              delegation: address.pendingAddress.delegation,
              municipio: address.pendingAddress.municipio,
              street: address.pendingAddress.street
            }
          });
        }
      }
    }

    return NextResponse.json({ code: "OK", message: "Person created successfully", data: person });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
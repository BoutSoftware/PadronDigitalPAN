import prisma from "@/configs/database";
import { hasIncompleteFields } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const { isSuperAdmin } = await req.json();

  if (hasIncompleteFields({ id, isSuperAdmin })) {
    return NextResponse.json({ code: "INCOMPLETE_FIELDS", message: "Some fields are missing" });
  }

  try {
    await prisma.user.update({
      where: {
        id
      },
      data: {
        isSuperAdmin
      }
    });

    return NextResponse.json({ code: "OK", message: "Superadmin status updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ code: "ERROR", message: "An error occurred" });
  }
}
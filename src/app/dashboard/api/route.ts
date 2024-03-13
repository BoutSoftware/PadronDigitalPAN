import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  request.headers.has("Authorization");

  return NextResponse.json({ message: "Welcome to the Dashboard API" });
}
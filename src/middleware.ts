import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  

  if (request.nextUrl.pathname.startsWith("/dashboard/api/visor")) {
    console.log();
    
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
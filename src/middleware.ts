import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withClerkMiddleware((req: NextRequest) => {
  const response = NextResponse.next();

  if (req.nextUrl.pathname.startsWith("/api/ingest")) {
    response.headers.append("Access-Control-Allow-Origin", "*");
  }

  return response;
});

export const config = {
  matcher: ["/((?!_next|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};

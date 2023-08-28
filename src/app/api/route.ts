import { NextResponse, type NextRequest } from "next/server";

import { headers } from "next/headers";

export async function GET(request: Request) {
  const requestHeaders = new Headers(request.headers);
  const referer = requestHeaders.get("referer");

  return new Response("Hello, Next.js!", {
    status: 200,
  });
}

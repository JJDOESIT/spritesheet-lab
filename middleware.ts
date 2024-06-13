import { NextRequest, NextResponse } from "next/server";
import { cookieUpdate, cookieGet } from "./app/functions/cookies";

// Authenticate cookie session 
async function cookieAuth(
  request: NextRequest,
  SESSION_NAME: string,
  redirectURL: string
) {
  // Fetch the cookie from session
  const cookie = await cookieGet(SESSION_NAME);
  if (cookie == null) {
    return NextResponse.redirect(new URL(redirectURL, request.url));
  }
  const COOKIE_EXPIRATION_TIME = 1000 * 60 * 60 * 2; // <-- Update by 2 hours
  return await cookieUpdate(
    request,
    process.env.SESSION_NAME!,
    COOKIE_EXPIRATION_TIME
  );
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/settings")) {
    return await cookieAuth(request, process.env.SESSION_NAME!, "/login");
  }
}

export const config = {
  matcher: "/settings",
};

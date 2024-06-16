import { NextRequest, NextResponse } from "next/server";
import { cookieUpdate } from "./app/functions/cookies";
import isAuthenticated from "./app/functions/isAuthenticated";

// Authenticate cookie session
async function cookieAuth(
  request: NextRequest,
  SESSION_NAME: string,
  redirectURL: string
) {
  // Fetch the cookie from session
  const response: { auth: boolean; cookie: any } = await isAuthenticated(
    SESSION_NAME
  );

  // If not authenticated
  if (!response.auth || !response.cookie) {
    // Redirect
    return NextResponse.redirect(new URL(redirectURL, request.url));
  }
  // Update to cookie session expiration time
  const COOKIE_EXPIRATION_TIME = parseInt(process.env.SESSION_TIME!);
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

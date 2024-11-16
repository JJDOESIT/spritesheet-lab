import { NextRequest, NextResponse } from "next/server";
import { cookieUpdate } from "./app/functions/cookies";
import { isAuthenticated } from "./app/functions/cookies";

// Authenticate cookie session
async function cookieAuth(
  request: NextRequest,
  SESSION_NAME: string,
  redirectURL: string,
  checkEmail: boolean,
  restrictIfVerified: boolean
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

  // If the email verification needs to be checked
  if (checkEmail) {
    var status = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/manual-email-check",
      {
        method: "POST",
        body: JSON.stringify({
          username: response.cookie.username,
        }),
      }
    );
    // Parse the response and set status
    status = await status.json();
    if (status != 200) {
      // Redirect
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
  }
  // If the user's email is verified, restrict access
  if (restrictIfVerified) {
    var status = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/manual-email-check",
      {
        method: "POST",
        body: JSON.stringify({
          username: response.cookie.username,
        }),
      }
    );
    // Parse the response and set status
    status = await status.json();
    if (status == 200) {
      // Redirect
      return NextResponse.redirect(new URL("/gallery", request.url));
    }
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
  if (
    request.nextUrl.pathname.startsWith("/messages") ||
    request.nextUrl.pathname.startsWith("/notifications")
  ) {
    //return NextResponse.redirect(new URL("/page-not-found", request.url));
  } else if (
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/upload") ||
    request.nextUrl.pathname.startsWith("/liked-sheets")
  ) {
    return await cookieAuth(
      request,
      process.env.SESSION_NAME!,
      "/login",
      true,
      false
    );
  } else if (request.nextUrl.pathname.startsWith("/verify-email")) {
    return await cookieAuth(
      request,
      process.env.SESSION_NAME!,
      "/login",
      false,
      true
    );
  }
}

export const config = {
  matcher: [
    "/messages",
    "/messages/:messageId*",
    "/settings",
    "/upload",
    "/upload",
    "/liked-sheets",
    "/notifications",
    "/verify-email",
  ],
};

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Payload: Cookie to be encrypted. ie {username: jjdoesit, cookieExpires: 1200}
export async function cookieEncrypt(payload: any) {
  // Fetch and encrypt the secret encrypt key
  const COOKIE_ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
  const key = new TextEncoder().encode(COOKIE_ENCRYPT_KEY);
  // Sign the payload and return the issued session
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    /* .setExpirationTime("10 sec from now") */
    .sign(key);
}

// Input: An encrypted cookie string (given by cookies().get('session')?.value!)
export async function cookieDecrypt(input: string) {
  // Fetch and encrypt the secret encrypt key
  const COOKIE_ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
  const key = new TextEncoder().encode(COOKIE_ENCRYPT_KEY);
  // Verify the input by signing with the secret key
  var payload;
  try {
    const { payload: verifiedPayload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    payload = verifiedPayload;
  } catch (e) {
    payload = null;
  }
  return payload;
}

export async function cookieDelete(name: string) {
  // Set the cookie expiration date to be in the past
  cookies().set(name!, "", { expires: new Date(0) });
}

export async function cookieGet(name: string) {
  const cookie = cookies().get(name!)?.value;
  // If there is no cookie -> return null
  if (cookie == null) {
    return null;
  }
  // Decrypt the cookie
  return await cookieDecrypt(cookie);
}

export async function cookieUpdate(
  request: NextRequest,
  name: string,
  updateTime: number
) {
  // Fetch the current session
  const cookie = request.cookies.get(name!)?.value;
  // If the session doesn't exist -> return null
  if (cookie == null) {
    return null;
  }
  // Decrypt the current session
  const parsed = await cookieDecrypt(cookie);

  if (parsed == null) {
    return null;
  }
  // Update the current session to extend time
  parsed.expires = new Date(Date.now() + updateTime);
  const result = NextResponse.next();
  result.cookies.set(name!, await cookieEncrypt(parsed), {
    httpOnly: true,
    expires: parsed.expires as Date,
  });
  return result;
}

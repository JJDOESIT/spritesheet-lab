import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export async function cookieEncrypt(payload: any) {
  // Fetch and encrypt the secret encrypt key
  const COOKIE_ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
  const key = new TextEncoder().encode(COOKIE_ENCRYPT_KEY);
  // Sign the payload and return the issued session
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function cookieDecrypt(input: string) {
  // Fetch and encrypt the secret encrypt key
  const COOKIE_ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY;
  const key = new TextEncoder().encode(COOKIE_ENCRYPT_KEY);
  // Verify the input by signing with the secret key
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
  return payload;
}

export async function cookieDelete(name: string) {
  // Set the cookie expiration date to be in the past
  cookies().set(name, "", { expires: new Date(0) });
}

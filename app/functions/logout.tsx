"use server";

import { cookieDelete } from "./cookies";

export default async function logout() {
  var status;
  try {
    // Delete the session cookie
    await cookieDelete(process.env.SESSION_NAME!);
    status = 200;
  } catch (e) {
    // Error fetching request body -> return 500
    status = 500;
  }
  return status;
}

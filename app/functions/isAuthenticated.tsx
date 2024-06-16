"use server";

import { cookieGet } from "./cookies";

export default async function isAuthenticated(sessionName: string) {
  var auth;
  var cookie;
  try {
    // Fetch the current auth session
    cookie = await cookieGet(sessionName);
    // If the user is logged in
    if (cookie) {
      auth = true;
    } else {
      // If the user is not logged in
      auth = false;
      cookie = null;
    }
  } catch (e) {
    // Unresolved error
    auth = false;
    cookie = null;
  }
  return { auth: auth, cookie: cookie };
}

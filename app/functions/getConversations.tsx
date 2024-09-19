"use server";

import { cookieGet } from "./cookies";

export default async function getConversations() {
  var data;
  try {
    const cookie = await cookieGet(process.env.SESSION_NAME!);
    if (cookie) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "api/get-conversations",
        {
          method: "POST",
          body: JSON.stringify({ username: cookie.username }),
        }
      );
      data = await response.json();

      return data.data;
    } else {
      throw new Error("No cookie found");
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

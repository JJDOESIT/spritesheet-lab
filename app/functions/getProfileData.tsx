"use server";

import { cookieGet } from "./cookies";

export default async function getProfileData() {
  var data;
  try {
    // Fetch the current auth session
    const cookie = await cookieGet(process.env.SESSION_NAME!);
    if (cookie) {
      // Fetch the profile data
      const response = await fetch(
        process.env.BASE_URL + "api/get-profile-data",
        {
          method: "POST",
          body: JSON.stringify({ username: cookie.username }),
        }
      );
      data = await response.json();
      // If the data exists
      if (data != null) {
        data = data.data;
      }
      // If the data doesn't exist -> return null
      else {
        data = null;
      }
    } else {
      data = null;
    }
  } catch (e) {
    // Error fetching data -> return null
    data = null;
  }
  return data;
}

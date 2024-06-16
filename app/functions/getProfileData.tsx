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
      // If the data exists, set the profile image, username, name, and bio
      if (data) {
        data = {
          profile_image: data.data.profile_image,
          username: cookie.username as string,
          name: data.data.name,
          bio: data.data.bio,
        };
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

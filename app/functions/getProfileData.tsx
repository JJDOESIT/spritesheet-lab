"use server";

import { cookieGet } from "./cookies";

export type ProfileData = {
  profile_image: string;
  username: string;
  name: string | null;
  bio: string | null;
  liked_posts: Array<string>;
};

// If username is passed in, fetch profile data of the username, else fetch the logged in user's data
export default async function getProfileData(username: string | null = null) {
  var data;
  try {
    // Fetch the current auth session
    if (!username) {
      const cookie = await cookieGet(process.env.SESSION_NAME!);
      if (cookie) {
        username = cookie.username as string;
      }
    }
    if (username) {
      // Fetch the profile data
      const response = await fetch(
        process.env.BASE_URL + "api/get-profile-data",
        {
          method: "POST",
          body: JSON.stringify({ username: username }),
        }
      );
      data = await response.json();
      // If the data exists, set the profile image, username, name, and bio
      if (data) {
        data = {
          profile_image: data.data.profile_image,
          username: username as string,
          name: data.data.name as string,
          bio: data.data.bio as string,
          liked_posts: data.data.liked_posts as Array<any>,
        } as ProfileData;
      } else {
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

"use server";

import { cookieGet } from "./cookies";

export type ProfileData = {
  profile_image: any | null;
  username: string;
  name: string | null;
  bio: string | null;
  liked_posts: Array<string> | null;
};

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
    const cookie = await cookieGet(process.env.SESSION_NAME!);
    if (cookie) {
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
          name: data.data.name,
          bio: data.data.bio,
          liked_posts: data.data.liked_posts,
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

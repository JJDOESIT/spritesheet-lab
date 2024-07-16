"use server";

import { isAuthenticated } from "./cookies";

// Types are USERNAME, BEST, WORST,
export default async function fetchGalleryPosts(
  type: string,
  username: string | null
) {
  var gallery;
  try {
    // Fetch gallery posts with authentication
    if (type === "USERNAME_WITH_AUTH") {
      if (username) {
        // Fetch the current auth session
        var responseData: { auth: boolean; cookie: any } =
          await isAuthenticated(process.env.SESSION_NAME!);
        // If the user is authenticated
        if (
          responseData.auth &&
          responseData.cookie &&
          responseData.cookie.username === username
        ) {
          // API call to fetch gallery posts
          const response = await fetch(
            process.env.BASE_URL + "/api/fetch-gallery-posts",
            {
              method: "POST",
              body: JSON.stringify({
                type: type,
                username: username,
              }),
            }
          );
          // Parse the response and set status
          gallery = await response.json();
        } else {
          // User is not authenticated -> return null
          gallery = null;
        }
      } else {
        // Username undefined -> return null
        gallery = null;
      }
    }
    // Fetch gallery posts without authentication
    else if (type == "USERNAME_NO_AUTH") {
      if (username) {
        // API call to fetch gallery posts
        const response = await fetch(
          process.env.BASE_URL + "/api/fetch-gallery-posts",
          {
            method: "POST",
            body: JSON.stringify({
              type: type,
              username: username,
            }),
          }
        );
        // Parse the response and set status
        gallery = await response.json();
      } else {
        // Username undefined -> return null
        gallery = null;
      }
    } else if (type === "BEST") {
      // API call to fetch gallery posts
      const response = await fetch(
        process.env.BASE_URL + "/api/fetch-gallery-posts",
        {
          method: "POST",
          body: JSON.stringify({
            type: type,
          }),
        }
      );
      // Parse the response and set status
      gallery = await response.json();
    } else if (type === "WORST") {
      // API call to fetch gallery posts
      const response = await fetch(
        process.env.BASE_URL + "/api/fetch-gallery-posts",
        {
          method: "POST",
          body: JSON.stringify({
            type: type,
          }),
        }
      );
      // Parse the response and set status
      gallery = await response.json();
    } else {
      // Invalid type -> return null
      gallery = null;
    }
  } catch (e) {
    console.log(e);
    // Internal server error -> return null
    gallery = null;
  }
  return gallery;
}

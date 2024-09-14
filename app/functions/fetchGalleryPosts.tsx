"use server";

import { isAuthenticated } from "./cookies";

// Types are USERNAME, BEST, WORST,
export default async function fetchGalleryPosts(
  searchInput: string | null,
  searchType: string,
  sortType: string
) {
  var gallery;
  try {
    // Fetch gallery posts with authentication
    if (sortType === "LIKED") {
      // Fetch the current auth session
      var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
        process.env.SESSION_NAME!
      );
      // If the user is authenticated
      if (
        responseData.auth &&
        responseData.cookie &&
        responseData.cookie.username
      ) {
        // API call to fetch gallery posts
        const response = await fetch(
          process.env.BASE_URL + "/api/fetch-gallery-posts",
          {
            method: "POST",
            body: JSON.stringify({
              searchInput: searchInput,
              searchType: searchType,
              sortType: sortType,
              username: responseData.cookie.username,
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
      // API call to fetch gallery posts
      const response = await fetch(
        process.env.BASE_URL + "/api/fetch-gallery-posts",
        {
          method: "POST",
          body: JSON.stringify({
            searchInput: searchInput,
            searchType: searchType,
            sortType: sortType,
          }),
        }
      );
      // Parse the response and set status
      gallery = await response.json();
    }
  } catch (e) {
    console.log(e);
    // Internal server error -> return null
    gallery = null;
  }
  return gallery;
}

"use server";

import { isAuthenticated } from "@/app/functions/cookies";

export default async function deletePost(postAuthor: string, postID: string) {
  var status;
  try {
    // Fetch the current auth session
    var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
      process.env.SESSION_NAME!
    );
    // If the user is authenticated
    if (responseData.auth && responseData.cookie) {
      // Double check to make sure the author is deleting the post
      if (postAuthor === responseData.cookie.username) {
        // API POST request to delete post from thedatabase
        const response = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/delete-from-db",
          {
            method: "POST",
            body: JSON.stringify({
              collection: process.env.NEXT_PUBLIC_POSTS_DB_NAME!,
              id: postID,
            }),
          }
        );
        // Parse the response and set status
        status = await response.json();
      } else {
        // Else permission is denied
        status = 400;
      }
    } else {
      // User is not authenticated -> return 400
      status = 400;
    }
  } catch (e) {
    // Failed to delete post -> return 500
    console.log(e);
    status = 500;
  }
  return status;
}

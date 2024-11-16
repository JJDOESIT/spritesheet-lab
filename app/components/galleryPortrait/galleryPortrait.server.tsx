"use server";

import { isAuthenticated } from "@/app/functions/cookies";
import { notifyUser } from "@/app/functions/notify";

export async function likePost(postID: string, author: string) {
  var status;

  try {
    // Fetch the current auth session
    var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
      process.env.SESSION_NAME!
    );
    // If the user is authenticated
    if (responseData.auth && responseData.cookie) {
      // API POST request to upload data into database
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/post-likes",
        {
          method: "POST",
          body: JSON.stringify({
            type: "like",
            user: responseData.cookie.username,
            data: { postID: postID, author: author },
          }),
        }
      );
      // Parse the response and set status
      status = await response.json();
      // Notify the user
      await notifyUser(author, "l", postID);
    }
  } catch (e) {
    // Internal server error -> return 500
    status = 500;
  }
  return status;
}

export async function unlikePost(postID: string) {
  var status;

  try {
    // Fetch the current auth session
    var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
      process.env.SESSION_NAME!
    );
    // If the user is authenticated
    if (responseData.auth && responseData.cookie) {
      // API POST request to upload data into database
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/post-likes",
        {
          method: "POST",
          body: JSON.stringify({
            type: "unlike",
            user: responseData.cookie.username,
            data: { postID: postID, author: null },
          }),
        }
      );
      // Parse the response and set status
      status = await response.json();
    }
  } catch (e) {
    // Internal server error -> return 500
    status = 500;
  }
  return status;
}

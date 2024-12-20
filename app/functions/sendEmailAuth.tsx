"use server";

import { isAuthenticated } from "@/app/functions/cookies";

export default async function sendEmailAuth(username: string | null) {
  var data;
  try {
    // If we want to authenticate
    if (!username) {
      // Fetch the current auth session
      var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
        process.env.SESSION_NAME!
      );
      // If the user is authenticated
      if (responseData.auth && responseData.cookie) {
        // API POST request to send email token to user
        const response = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/send-email-auth",
          {
            method: "POST",
            body: JSON.stringify({
              user: responseData.cookie.username,
            }),
          }
        );
        // Parse the response and set status
        data = await response.json();
      } else {
        // User is not authenticated -> return null
        data = null;
      }
    }
    // Else just send request with the given username
    else {
      // API POST request to send email token to user
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/send-email-auth",
        {
          method: "POST",
          body: JSON.stringify({
            user: username,
          }),
        }
      );
      // Parse the response and set status
      data = await response.json();
    }
  } catch (e) {
    // Failed to send email -> return null
    console.log(e);
    data = null;
  }
  return data;
}

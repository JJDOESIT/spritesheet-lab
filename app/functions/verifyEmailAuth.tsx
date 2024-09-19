"use server";

import { isAuthenticated } from "@/app/functions/cookies";

export default async function verifyEmailAuth(token: string) {
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
        process.env.NEXT_PUBLIC_BASE_URL + "/api/verify-email-auth",
        {
          method: "POST",
          body: JSON.stringify({
            user: responseData.cookie.username,
            token: token,
          }),
        }
      );
      // Parse the response and set status
      status = await response.json();
    } else {
      // User is not authenticated -> return 400
      status = 400;
    }
  } catch (e) {
    // Failed to insert data -> return 500
    console.log(e);
    status = 500;
  }
  return status;
}

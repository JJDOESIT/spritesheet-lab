"use server";

import { isAuthenticated } from "@/app/functions/cookies";

export default async function canSendEmail() {
  var data;

  try {
    // Fetch the current auth session
    var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
      process.env.SESSION_NAME!
    );

    // If the user is authenticated
    if (responseData.auth && responseData.cookie) {
      // Post to the can-send-email endpoint
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/can-send-email",
        {
          method: "POST",
          body: JSON.stringify({
            username: responseData.cookie.username,
          }),
        }
      );
      // Parse the response and set status
      data = await response.json();
    }
  } catch (e) {
    // Faield to verify data -> return 500
    data["status"] = 500;
    data["waitTime"] = 0;
  }
  return data;
}

"use server";

import { isAuthenticated } from "@/app/functions/cookies";

export default async function uploadToDB(collection: string, data: any) {
  var status;
  try {
    // Fetch the current auth session
    var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
      process.env.SESSION_NAME!
    );
    // If the user is authenticated
    if (responseData.auth && responseData.cookie) {
      // API POST request to upload data into database
      const response = await fetch(process.env.BASE_URL + "/api/upload-to-db", {
        method: "POST",
        body: JSON.stringify({
          collection: collection,
          user: responseData.cookie.username,
          data: data,
        }),
      });
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

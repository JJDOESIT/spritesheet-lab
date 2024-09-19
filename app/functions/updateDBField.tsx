"use server";

import { isAuthenticated } from "@/app/functions/cookies";

export default async function updateDBField(
  collection: string,
  field: string,
  data: any
) {
  var status;

  try {
    // Fetch the current auth session
    var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
      process.env.SESSION_NAME!
    );

    // If the user is authenticated
    if (responseData.auth && responseData.cookie) {
      // Post to the db-update-field endpoint
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/db-update-field",
        {
          method: "POST",
          body: JSON.stringify({
            collection: collection,
            user: responseData.cookie.username,
            field: field,
            data: data,
          }),
        }
      );
      // Parse the response and set status
      status = await response.json();
    }
  } catch (e) {
    // Faield to update data -> return 500
    status = 500;
  }
  return status;
}

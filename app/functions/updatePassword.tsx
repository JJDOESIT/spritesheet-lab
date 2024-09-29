"use server";

import { isAuthenticated } from "@/app/functions/cookies";
import { passwordEncrypt } from "./password";
import updateDBField from "./updateDBField";

export default async function updatePassword(password) {
  var status;
  try {
    // Fetch the current auth session
    var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
      process.env.SESSION_NAME!
    );
    // If the user is authenticated
    if (responseData.auth && responseData.cookie) {
      // Hash the password
      const hash = await passwordEncrypt(password, 10);
      // Update the password field with the new hashed password
      const response = await updateDBField(
        process.env.NEXT_PUBLIC_USERS_DB_NAME!,
        "password",
        hash
      );
      status = response;
      return status;
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

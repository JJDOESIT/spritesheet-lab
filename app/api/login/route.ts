import clientPromise from "../../../lib/mongodb";
import { cookieEncrypt } from "@/app/functions/cookies";
import { passwordDecrypt } from "@/app/functions/password";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  var status;

  try {
    // Fetch data from POST request
    var data = await request.json();
    // Convert the username to lowercase
    data.username = data.username.toLowerCase();
  } catch (e) {
    // Internal server error -> return 500
    status = 500;
    return new Response(JSON.stringify({ status: status }));
  }

  try {
    // Fetch username from body
    const username = data.username;
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    // Check if the username exists in the database
    const users = await db
      .collection("users")
      .findOne({ username: data.username });
    if (users != null) {
      const match = await passwordDecrypt(data.password, users.password);
      if (match) {
        // Set a date for when the session expires
        const cookieExpires = new Date(
          Date.now() + parseInt(process.env.SESSION_TIME!)
        );
        //Create a signed session
        const cookie = await cookieEncrypt({ username, cookieExpires });
        // Save the session in a cookie
        cookies().set(process.env.SESSION_NAME!, cookie, {
          expires: cookieExpires,
          httpOnly: true,
        });
        // If the user has their email verified -> return 200
        if (users["email_verified"]) {
          status = 200;
        }
        // Else they have not verified their email -> return 210
        else {
          status = 210;
        }
      } else {
        // Password didn't match the hashed password -> return 404
        status = 404;
      }
    } else {
      // Username wasn't found in the database -> return 404
      status = 404;
    }
  } catch (e) {
    console.error(e);
    // Couldn't connect to database -> return 500
    status = 500;
  }
  return new Response(JSON.stringify({ status: status }));
}

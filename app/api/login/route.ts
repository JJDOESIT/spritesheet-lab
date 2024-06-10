import clientPromise from "../../../lib/mongodb";
import { cookieEncrypt, cookieDecrypt } from "@/app/functions/cookies";
import { passwordDecrypt } from "@/app/functions/password";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  var status = 500;
  var SESSION_NAME = process.env.SESSION_NAME;

  // If the session name doesn't exist, set its default name to session
  if (!SESSION_NAME) {
    SESSION_NAME = "session";
  }

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
    const db = client.db("db");
    // Check if the username exists in the database
    const users = await db
      .collection("users")
      .findOne({ username: data.username });
    if (users != null) {
      const match = await passwordDecrypt(data.password, users.password);
      if (match) {
        // Set a date for when the session expires
        const cookieExpires = new Date(Date.now() + 10 * 720);
        //Create a signed session
        const session = await cookieEncrypt({ username, cookieExpires });
        // Save the session in a cookie
        cookies().set(SESSION_NAME, session, {
          expires: cookieExpires,
          httpOnly: true,
        });
        status = 200;
      } else {
        // Password didn't match the hashed password -> return 404
        status = 404;
      }
    } else {
      // Username wasn't found in the database -> return 404
      status = 404;
    }
  } catch (e) {
    // Couldn't connect to database -> return 500
    status = 500;
  }
  return new Response(JSON.stringify({ status: status }));
}

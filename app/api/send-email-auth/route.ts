import clientPromise from "../../../lib/mongodb";
import { passwordEncrypt } from "@/app/functions/password";

export async function POST(request: Request) {
  var data;

  try {
    // Fetch data from POST request
    var data = await request.json();
    var username = data.user;
  } catch (e) {
    // Internal server error -> return null
    data = null;
    return new Response(JSON.stringify(data));
  }

  try {
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Find the logged in user's email
    const info = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({
        username: username,
      });

    if (info) {
      // Insert the hashed email into the temp email auth database
      const token = (await passwordEncrypt(info.email, 2)) as string;
      db.collection(process.env.NEXT_PUBLIC_EMAIL_AUTH!).insertOne({
        username: username,
        token: token,
        expiresAfter: new Date(),
      });
      data = { email: info.email, username: username, token: token };
    }
    // Session expired -> return null
    else {
      data = null;
    }
  } catch (e) {
    console.error(e);
    // Couldn't connect to database -> return null
    data = null;
  }
  return new Response(JSON.stringify(data));
}

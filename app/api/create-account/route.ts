import clientPromise from "../../../lib/mongodb";
import encrypt from "@/app/functions/encrypt";

export async function POST(request: Request) {
  var data = await request.json();
  var status;

  try {
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db("db");
    // Check if the username is taken
    const users = await db
      .collection("users")
      .findOne({ username: data.username });
    // If the username is not taken
    if (users == null) {
      try {
        // Attempt to encrypt the password
        const hash = await encrypt(data.password, 10);
        // Attempt to insert the password into the 'users' database
        await db.collection("users").insertOne({
          username: data.username,
          password: hash,
        });
        status = 200;
      } catch (e) {
        status = 500;
      }
    } else {
      status = 400;
    }
  } catch (e) {
    status = 500;
  }

  return new Response(JSON.stringify({ status: status }));
}

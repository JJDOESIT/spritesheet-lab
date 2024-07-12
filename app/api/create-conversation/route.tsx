import { Rye } from "next/font/google";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    // Fetch data from POST request
    var data = await request.json();

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db("db");

    var users: String[] = data.users;
    var ids: ObjectId[] = [];

    await Promise.all(users.map(async (element) => {
        const id = await db.collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!).findOne({ username: element });
        if (id && id._id) {
            ids.push(id._id);
        } else {
            return new Response(JSON.stringify({ data: null }));
        }
    }));

    const conversations = await db
      .collection(process.env.CONVERSATIONS_DB_NAME!).insertOne({
        users : ids,
        messages: []
      })

    return new Response(JSON.stringify({ data: true}));
  } catch (e) {
    console.error(e);

    return new Response(JSON.stringify({ data: null }));
  }
}

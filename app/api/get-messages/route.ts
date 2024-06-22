import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var data;
  try {
    const body = await request.json();

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const userId = await db.collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!).findOne({ username : body.username });

    if (!userId) {
      throw new Error("No user found");
    }

    const conversation = await db.collection(process.env.CONVERSATIONS_DB_NAME!).findOne({ _id: ObjectId.createFromHexString(body.conversationID), users: userId._id});

    if (!conversation) {
      throw new Error("No conversation found");
    }

    var messages = await Promise.all(conversation.messages.map(async (message: ObjectId) => {
      return await db.collection("messages").findOne({ _id: message });
    }));

    await Promise.all(messages.map(async (message: any) => {
      var user = await db.collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!).findOne({ _id: message.user });
      if (!user)
      {
        throw new Error("No sender found");
      }
      message.user = user.username;
    }));

    return new Response(JSON.stringify({ data: messages }));
  } catch (e) {
    console.error(e);
    data = null;
  }
  return new Response(JSON.stringify({ data: data }));
}

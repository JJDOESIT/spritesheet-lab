import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var data;
  try {
    const body = await request.json();

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const user = await db.collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!).findOne({ username : body.username });

    if (!user || !user._id) {
      throw new Error("No user found");
    }

    const conversation = await db.collection(process.env.CONVERSATIONS_DB_NAME!).findOne({ _id: ObjectId.createFromHexString(body.conversationID), users: user._id});

    if (!conversation) {
      throw new Error("No conversation found");
    }

    const message = await db.collection(process.env.MESSAGES_DB_NAME!).findOne({ _id: ObjectId.createFromHexString(body.messageID), user: user._id });

    if (!message) {
      throw new Error("No message found");
    }

    await db.collection(process.env.MESSAGES_DB_NAME!).deleteOne({ _id: ObjectId.createFromHexString(body.messageID) });

    await conversation.updateOne({ $pull: { messages: ObjectId.createFromHexString(body.messageID) } });

    return new Response(JSON.stringify({ data: "Message deleted" }));
  } catch (e) {
    console.error(e);
    data = null;
  }
  return new Response(JSON.stringify({ data: data }));
}

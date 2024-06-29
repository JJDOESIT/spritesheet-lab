import { ObjectId, PushOperator } from "mongodb";
import clientPromise from "../../../lib/mongodb";

type Conversation = {
  messages: Object[],
  users: ObjectId[]
}

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


    const newMessage = await db.collection(process.env.MESSAGES_DB_NAME!).insertOne(
    {
        message: body.message,
        user: userId._id
    }
    );

    await db.collection('conversations').updateOne(
      { _id: ObjectId.createFromHexString(body.conversationID) },
      { $push: { messages: { $each: [newMessage.insertedId], $position: 0 } } } as unknown as PushOperator<ObjectId>
    );

    return new Response(JSON.stringify({ data: "Message sent"}));
  } catch (e) {
    console.error(e);
    data = null;
  }
  return new Response(JSON.stringify({ data: "Message Failed" }));
}
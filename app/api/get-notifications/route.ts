import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var data;
  try {
    const body = await request.json();

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const id = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({ username: body.username });

    if (!id || !id._id) {
      throw new Error("User not found");
    }

    const user_document = await db
      .collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!)
      .findOne({ foreign_key: id._id });

    // If the account exists
    if (user_document) {
        data = user_document.notifications;
    }

  } catch (e) {
    data = null;
    console.log(e);
  }
  return new Response(JSON.stringify({ data: data }));
}

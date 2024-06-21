import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var data;
  try {
    const body = await request.json();

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Fetch the id from the newly created account
    const id = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({ username: body.username });

    // If the account exists
    if (id && id._id) {
      data = await db
        .collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!)
        .findOne({ foreign_key: id._id });
    } else {
      data = null;
    }
  } catch (e) {
    data = null;
    console.log(e);
  }
  return new Response(JSON.stringify({ data: data }));
}

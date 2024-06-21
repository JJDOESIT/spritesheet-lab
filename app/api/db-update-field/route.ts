import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var status;
  try {
    // Fetch collection, user, and data from the request body
    const body = await request.json();
    const collection = body.collection;
    const field = body.field;
    const user = body.user;
    const data = body.data;

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Fetch the id from the newly created account
    const id = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({ username: user });

    // If the user account exists
    if (id && id._id) {
      // Insert data into the collection with the associated user
      db.collection(collection).updateOne(
        { foreign_key: id._id },
        { $set: { [field]: data } }
      );
      // Success -> return 200
      status = 200;
    } else {
      // Coudln't find user -> return 404
      status = 404;
    }
  } catch (e) {
    // Error uploading -> return 500
    status = 500;
  }
  return new Response(JSON.stringify(status));
}

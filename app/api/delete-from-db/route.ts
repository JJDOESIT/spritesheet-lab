import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  var status;
  try {
    // Fetch id from the request body
    const body = await request.json();
    const collection = body.collection;
    const id = ObjectId.createFromHexString(body.id);

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Delete the document from the given collection based on the given id
    db.collection(collection).deleteOne({ _id: id });

    // Success -> return 200
    status = 200;
  } catch (e) {
    // Error deleting -> return 500
    status = 500;
  }
  return new Response(JSON.stringify(status));
}

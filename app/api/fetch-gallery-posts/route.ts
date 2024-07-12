import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var gallery;
  try {
    // Fetch data from POST request
    var data = await request.json();
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db("db");

    if (data.username) {
      const profile = await db
        .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
        .findOne({ username: data.username });
      const id = profile?._id;
      if (id) {
        const posts = await db
          .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
          .find({ foreign_key: id })
          .toArray();

        gallery = posts;
      }
    }
  } catch (e) {
    console.log(e);
    gallery = null;
  }
  return new Response(JSON.stringify(gallery));
}

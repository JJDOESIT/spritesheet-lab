import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var gallery;
  try {
    // Fetch data from POST request
    var data = await request.json();
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db("db");

    // Sort by username with authentication
    if (data.type === "USERNAME_WITH_AUTH") {
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
    }
    // Sort by username without authentication
    else if (data.type === "USERNAME_NO_AUTH") {
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
    }
    // Sort by most liked
    else if (data.type === "BEST") {
      const posts = await db
        .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
        .find({}, { sort: { likes: -1 } })
        .toArray();
      gallery = posts;
    }
    // Sort by least liked
    else if (data.type === "WORST") {
      const posts = await db
        .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
        .find({}, { sort: { likes: 1 } })
        .toArray();
      gallery = posts;
    } else {
      // Undefined type given -> return null
      gallery = null;
    }
  } catch (e) {
    // Internal server error -> return null
    console.log(e);
    gallery = null;
  }
  return new Response(JSON.stringify(gallery));
}

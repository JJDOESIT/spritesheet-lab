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
    if (data.searchType === "USERNAME_WITH_AUTH") {
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
    else if (data.searchType === "USERNAME_NO_AUTH") {
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
    // Search using the given input
    else if (data.searchType === "TITLE") {
      // Sort by best
      if (data.sortType === "BEST") {
        // If the input is not empty, use hazy search
        if (data.searchInput) {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              {
                $search: {
                  index: "HazySearch",
                  text: {
                    query: data.searchInput,
                    path: ["title"],
                    fuzzy: {
                      maxEdits: 2,
                    },
                  },
                },
              },
            ])
            .toArray();
          gallery = posts;
        }
        // Else return all resulted sorted in ascending order
        else {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .find({}, { sort: { likes: -1 } })
            .toArray();
          gallery = posts;
        }
      }
      // Sort by worst
      else if (data.sortType === "WORST") {
        // If the input is not empty, use hazy search
        if (data.searchInput) {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              {
                $search: {
                  index: "HazySearch",
                  text: {
                    query: data.searchInput,
                    path: ["title"],
                    fuzzy: {
                      maxEdits: 2,
                    },
                  },
                },
              },
            ])
            .toArray();
          gallery = posts;
        }
        // Else return all resulted sorted in descending order
        else {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .find({}, { sort: { likes: 1 } })
            .toArray();
          gallery = posts;
        }
      }
      // Invalid sort type given -> return null
      else {
        gallery = null;
      }
    }
    // Search by username
    else if (data.searchType === "USER") {
      const profile = await db
        .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
        .findOne({ username: data.searchInput.toLowerCase() });
      const id = profile?._id;
      if (id) {
        if (data.sortType === "BEST") {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              { $match: { "posts._id": id } },
              { $sort: { likes: -1 } },
            ])
            .toArray();
          gallery = posts;
        } else if (data.sortType === "WORST") {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              { $match: { "posts._id": id } },
              { $sort: { likes: -1 } },
            ])
            .toArray();
          gallery = posts;
        } else {
          // Invalid sort type given -> return null
          gallery = null;
        }
      } else {
        // User not found -> return empty array
        gallery = [];
      }
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

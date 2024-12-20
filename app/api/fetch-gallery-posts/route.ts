/* eslint-disable */
import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var gallery = null;
  try {
    // Fetch data from POST request
    var data = await request.json();
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db("db");
    // Sort by a users liked posts
    if (data.sortType === "LIKED") {
      // If the given username is not null
      if (data.username) {
        // Fetch the user's id
        const profile = await db
          .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
          .findOne({ username: data.username });
        const id = profile?._id;
        if (id) {
          const likedPosts = await db
            .collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!)
            .aggregate([
              {
                $match: {
                  foreign_key: id,
                },
              },
              { $unwind: "$liked_posts" },
              {
                $addFields: {
                  foreign_key: id, // This is the logged in user's ID
                  _id: "$liked_posts", // This is the individual post ID
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_POSTS_DB_NAME!,
                  localField: "_id",
                  foreignField: "_id",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  postAuthorID: "$posts.foreign_key",
                },
              },
              {
                $addFields: {
                  image: "$posts.image",
                  title: "$posts.title",
                  likes: "$posts.likes",
                  speed: "$posts.speed",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "postAuthorID",
                  foreignField: "_id",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  username: "$posts.username",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "postAuthorID",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
            ])
            .toArray();
          gallery = likedPosts;
        } else {
          // Cannot find user id -> return empty array
          return [];
        }
      } else {
        // Given username is not valid -> return empty array
        gallery = [];
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
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { likes: -1 } },
            ])
            .toArray();
          gallery = posts;
        }
        // Else return all resulted sorted in ascending order
        else {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              { $match: {} },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { likes: -1 } },
            ])
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
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { likes: 1 } },
            ])
            .toArray();
          gallery = posts;
        }
        // Else return all resulted sorted in descending order
        else {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              { $match: {} },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { likes: 1 } },
            ])
            .toArray();
          gallery = posts;
        }
      }
      // Sort by recent
      else if (data.sortType === "RECENT") {
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
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { _id: -1 } },
            ])
            .toArray();
          gallery = posts;
        }
        // Else return all resulted sorted in descending order
        else {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              { $match: {} },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { _id: -1 } },
            ])
            .toArray();
          gallery = posts;
        }
      }
      // Sort by oldest
      else if (data.sortType === "OLDEST") {
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
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { _id: 1 } },
            ])
            .toArray();
          gallery = posts;
        }
        // Else return all resulted sorted in descending order
        else {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              { $match: {} },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { _id: 1 } },
            ])
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
      // Fetch the user's id based on given username
      const profile = await db
        .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
        .findOne({ username: data.searchInput.toLowerCase() });
      const id = profile?._id;
      // If the user exists
      if (id) {
        // Sort by best
        if (data.sortType === "BEST") {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              { $match: { "posts.foreign_key": id } },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { likes: -1 } },
            ])
            .toArray();
          gallery = posts;
        }
        // Sort by worst
        else if (data.sortType === "WORST") {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              { $match: { "posts.foreign_key": id } },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { likes: 1 } },
            ])
            .toArray();
          gallery = posts;
        }
        // Sort by recent
        else if (data.sortType === "RECENT") {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              { $match: { "posts.foreign_key": id } },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { _id: -1 } },
            ])
            .toArray();
          gallery = posts;
        }
        // Sort by oldest
        else if (data.sortType === "OLDEST") {
          const posts = await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .aggregate([
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "foreign_key",
                  as: "posts",
                },
              },
              { $unwind: "$posts" },
              { $match: { "posts.foreign_key": id } },
              {
                $addFields: {
                  profile_image: "$posts.profile_image",
                },
              },
              {
                $lookup: {
                  from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
                  localField: "foreign_key",
                  foreignField: "_id",
                  as: "users",
                },
              },
              { $unwind: "$users" },
              {
                $addFields: {
                  username: "$users.username",
                },
              },
              {
                $project: {
                  image: 1,
                  title: 1,
                  likes: 1,
                  profile_image: 1,
                  username: 1,
                  speed: 1,
                },
              },
              { $sort: { _id: 1 } },
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

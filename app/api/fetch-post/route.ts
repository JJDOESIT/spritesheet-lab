import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  var post;
  try {
    // Fetch data from POST request
    var data = await request.json();
    const postID = ObjectId.createFromHexString(data.postID);
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db("db");
    var tempPost = await db
      .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
      .aggregate([
        { $match: { _id: postID } },
        {
          $lookup: {
            from: process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
            localField: "foreign_key",
            foreignField: "foreign_key",
            as: "profile",
          },
        },
        { $unwind: "$profile" },
        { $addFields: { profile_image: "$profile.profile_image" } },
        {
          $lookup: {
            from: process.env.NEXT_PUBLIC_USERS_DB_NAME!,
            localField: "foreign_key",
            foreignField: "_id",
            as: "users",
          },
        },
        { $unwind: "$users" },
        { $addFields: { username: "$users.username" } },
        {
          $project: {
            image: 1,
            profile_image: 1,
            title: 1,
            likes: 1,
            username: 1,
          },
        },
      ])
      .toArray();
    if (tempPost.length > 0) {
      post = tempPost[0];
    }
  } catch (e) {
    // Internal server error -> return null
    console.log(e);
    post = null;
  }
  return new Response(JSON.stringify(post));
}

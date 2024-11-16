import { notifyUser } from "@/app/functions/notify";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

// Search the array to determine if a post has been liked or not
function isPostLiked(likedPosts: Array<any>, postID: any) {
  for (let index = 0; index < likedPosts.length; index++) {
    if (likedPosts[index].equals(postID)) {
      return true;
    }
  }
  return false;
}

export async function POST(request: Request) {
  var status;
  try {
    // Fetch collection, user, and data from the request body
    const body = await request.json();
    const type = body.type;
    const user = body.user;
    var postID = body.data.postID;
    var author = body.data.author;
    postID = ObjectId.createFromHexString(postID);

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Fetch the id from the newly created account
    const id = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({ username: user });

    // If the user account exists
    if (id && id._id) {
      const data = await db
        .collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!)
        .findOne({ foreign_key: id._id });
      if (type === "like") {
        // If the post hasn't been liked already
        if (
          data &&
          data["liked_posts"] &&
          !isPostLiked(data["liked_posts"], postID)
        ) {
          // Insert data into the collection with the associated user
          await db
            .collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!)
            .updateOne(
              { foreign_key: id._id },
              { $push: { ["liked_posts"]: postID } }
            );
          // Update the like count
          await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .updateOne({ _id: postID }, { $inc: { likes: 1 } });
          // Success -> return 200
          status = 200;
        } else {
          // Else post is already liked -> return 410
          status = 410;
        }
      } else if (type === "unlike") {
        // If the post has been liked already
        if (
          data &&
          data["liked_posts"] &&
          isPostLiked(data["liked_posts"], postID)
        ) {
          // Delete liked post from the collection with the associated user
          await db
            .collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!)
            .updateOne(
              { foreign_key: id._id },
              { $pull: { ["liked_posts"]: postID } }
            );
          // Update the like count
          await db
            .collection(process.env.NEXT_PUBLIC_POSTS_DB_NAME!)
            .updateOne({ _id: postID }, { $inc: { likes: -1 } });
          // Success -> return 200
          status = 200;
        } else {
          // Post hasn't been liked -> return 404
          status = 404;
        }
      }
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

import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  try {
    // Fetch data from POST request
    var data = await request.json();

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db("db");

    const id = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({ username: data.username });
    if (!id || !id._id) {
      console.error("No user found");
      return new Response(JSON.stringify({ data: null }));
    }

    const conversations = await db
      .collection(process.env.CONVERSATIONS_DB_NAME!)
      .find({ users: id._id })
      .toArray();

    await await Promise.all(
      conversations.map(async (conversation) => {
        conversation.users = await Promise.all(
          conversation.users.map(async (user: any) => {
            const userObj = await db
              .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
              .findOne({ _id: user });
            const profileObj = await db
              .collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!)
              .findOne({foreign_key: user });
            if (userObj && profileObj) {

              return {username: userObj.username, profile_image: profileObj.profile_image};
            } else {
              return null;
            }
          })
        );
        conversation.users = conversation.users.filter((user: any) => user !== null);
      })
    );

    console.log(conversations[0].users);

    return new Response(JSON.stringify({ data: conversations }));
  } catch (e) {
    console.error(e);

    return new Response(JSON.stringify({ data: null }));
  }
}

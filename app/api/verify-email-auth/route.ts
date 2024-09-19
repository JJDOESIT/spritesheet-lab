import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var status;

  try {
    // Fetch data from POST request
    var data = await request.json();
    var username = data.user;
    var token = data.token;
  } catch (e) {
    // Internal server error -> return 500
    status = 500;
    return new Response(JSON.stringify({ status: status }));
  }

  try {
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Check if the token and logged in user matches a document in the temp database
    const result = await db
      .collection(process.env.NEXT_PUBLIC_EMAIL_AUTH!)
      .find({
        $and: [{ username: username }, { token: token }],
      })
      .toArray();
    // If a result is found
    if (result && result.length > 0) {
      // Set the email to be verified
      await db
        .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
        .updateOne({ username: username }, { $set: { email_verified: true } });
      // Remove all temp emails associated with the username
      await await db
        .collection(process.env.NEXT_PUBLIC_EMAIL_AUTH!)
        .deleteMany({
          username: username,
        });
      // Success -> return 200
      status = 200;
    }
    // Else no email was found or it has expired
    else {
      status = 404;
    }
  } catch (e) {
    console.error(e);
    // Couldn't connect to database -> return 500
    status = 500;
  }
  return new Response(JSON.stringify(status));
}

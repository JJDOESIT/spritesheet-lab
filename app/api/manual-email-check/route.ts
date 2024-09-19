import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var status;

  try {
    // Fetch data from POST request
    var data = await request.json();
    var username = data.username;
  } catch (e) {
    // Internal server error -> return 500
    status = 500;
    return new Response(JSON.stringify({ status: status }));
  }

  try {
    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const user = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({
        username: username,
      });
    // If the user is verified -> return 200
    if (user && user["email_verified"]) {
      status = 200;
    }
    // Else the user is not verified -> return 400
    else {
      status = 400;
    }
  } catch (e) {
    console.error(e);
    // Couldn't connect to database -> return 500
    status = 500;
  }
  return new Response(JSON.stringify(status));
}

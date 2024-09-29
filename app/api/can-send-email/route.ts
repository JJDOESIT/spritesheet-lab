import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var status;
  var waitTime = 0;
  const emailDelay = 60; // Number of seconds
  try {
    // Fetch collection, user, and data from the request body
    const body = await request.json();
    const username = body.username;

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const results = await db
      .collection(process.env.NEXT_PUBLIC_EMAIL_AUTH!)
      .find({ username: username })
      .toArray();
    var valid = true;
    for (let index = 0; index < results.length; index++) {
      const timeNow = new Date();
      const timeThen = new Date(results[index]["expiresAfter"]);
      const difference = Math.abs(timeNow - timeThen) / 1000;
      if (difference < emailDelay) {
        valid = false;
        waitTime = emailDelay - difference;
      }
    }
    if (valid) {
      status = 200;
    } else {
      status = 400;
    }
  } catch (e) {
    // Error -> return 500
    status = 500;
    console.log(e);
  }
  return new Response(JSON.stringify({ status: status, waitTime: waitTime }));
}

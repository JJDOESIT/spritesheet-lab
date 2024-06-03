import clientPromise from "../../../lib/mongodb";

export async function GET(request: Request) {
  return new Response(JSON.stringify({ message: "HELLO!" }));
}

export async function POST(request: Request) {
  var data = await request.json();
  var users;
  try {
    const client = await clientPromise;
    const db = client.db("db");
    users = await db.collection("users").findOne({ username: data.username });
  } catch (e) {
    console.log(e);
  }
  return new Response(JSON.stringify({ message: users }));
}

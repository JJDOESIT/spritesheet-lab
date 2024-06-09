import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var data = await request.json();
  var status = 500;
  return new Response(JSON.stringify({ status: 500 }));
}

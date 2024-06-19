import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
    var status = 500;

    try {
        // Fetch data from POST request
        var data = await request.json();

    } catch (e) {
        // Internal server error -> return 500
        status = 500;
        return new Response(JSON.stringify({ status: status }));
    }

}
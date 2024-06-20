import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
    try {
        // Fetch data from POST request
        var data = await request.json();

        // Connect to the database 'db'
        const client = await clientPromise;
        const db = client.db("db");

        console.log(data.username);
        const id = await db.collection(process.env.USERS_DB_NAME!).findOne({username: data.username});
        if (!id || !id._id) {
            console.error("No user found");
            return new Response(JSON.stringify({ data: null }));
        }

        const conversations = await db.collection('conversations').find({ users: id._id }).toArray();

        return new Response(JSON.stringify({data: conversations }));

    } catch (e) {
        console.error(e);
        
        return new Response(JSON.stringify({ data: null}));
    }

}
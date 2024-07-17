import clientPromise from "../../../lib/mongodb";

export async function POST(request: Request) {
  var data;
  try {
    const body = await request.json();

    // Connect to the database 'db'
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const notification = JSON.parse(body.notification);
    const removal = body.remove;

    const id = await db
      .collection(process.env.NEXT_PUBLIC_USERS_DB_NAME!)
      .findOne({ username: body.username });

    if (!id || !id._id) {
      throw new Error("User not found");
    }

    const user_document = await db
      .collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!)
      .findOne({ foreign_key: id._id });

    // If the account exists
    if (user_document) {
        if (removal)
        {
            if (user_document.notifications && user_document.notifications.length > 0) {
                user_document.notifications = user_document.notifications.reduce((acc: any[], n: any) => {
                  if (n.sender !== notification.sender || n.type !== notification.type || n.id !== notification.id) {
                    acc.push(n);
                  }
                  return acc;
                }, []);
                await db.collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!).updateOne(
                    { _id: user_document._id },
                    { $set: { notifications: user_document.notifications } }
                );
                data = "Notification removed successfully";
            } else {
                data = "No notifications found";
            }
        }
        else
        {
            if (!user_document.notifications) {
                user_document.notifications = [];
            }

            for (const n of user_document.notifications) {
              if (n.sender === notification.sender && n.type === notification.type && n.id === notification.id) {
                notification.stack = n.stack + 1;

                user_document.notifications = user_document.notifications.filter((n: any) => n.sender !== notification.sender || n.type !== notification.type || n.id !== notification.id);
                
                data = "Notification removed successfully";
              }
            }

            user_document.notifications.push(notification);

            await db.collection(process.env.NEXT_PUBLIC_PROFILES_DB_NAME!).updateOne(
                { _id: user_document._id },
                { $set: { notifications: user_document.notifications } }
            );
            data = "Notification added successfully";
        }
    }
  } catch (e) {
    data = null;
    console.log(e);
  }
  return new Response(JSON.stringify({ data: data }));
}

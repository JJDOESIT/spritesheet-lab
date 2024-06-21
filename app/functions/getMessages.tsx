"use server";
import { cookieGet } from "./cookies";

export default async function getMessages(conversationID : string) {
    console.log("ConversationID: " + conversationID);
    try {
        const cookie = await cookieGet(process.env.SESSION_NAME!);
        if (cookie) {
            const response = await fetch(
                process.env.BASE_URL + "api/get-messages",
                {
                method: "POST",
                body: JSON.stringify({ username: cookie.username, conversationID : conversationID }),
                }
            );
            var data = await response.json();

            console.log(data);

            return data.data;
        } else {
            throw new Error("No cookie found");
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}
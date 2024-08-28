"use server";

import { cookieGet } from "./cookies";


export default async function deleteMessage(conversationID: string, messageID: string) {
    try {
        const cookie = await cookieGet(process.env.SESSION_NAME!);
        if (cookie) {
            const response = await fetch(
                process.env.BASE_URL + "api/delete-message",
                {
                method: "POST",
                body: JSON.stringify({ username: cookie.username, conversationID: conversationID, messageID: messageID }),
                }
            );
        } else {
            throw new Error("No cookie found");
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }  
}
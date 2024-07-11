"use server";

import { cookieGet } from "./cookies";


export default async function createConversation(users: String[]) {
    console.log("running");
    try {
        const cookie = await cookieGet(process.env.SESSION_NAME!);
        if (cookie) {
            const response = await fetch(
                process.env.BASE_URL + "api/create-conversation",
                {
                method: "POST",
                body: JSON.stringify({ users: [...users, cookie.username] }),
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
"use server";
import { cookieGet } from "./cookies";


export async function getNotifications() {
    console.log("Getting notifications");
    var data;
    try {
        const cookie = await cookieGet(process.env.SESSION_NAME!);
        if (cookie) {
            const response = await fetch(
                process.env.BASE_URL + "api/get-notifications",
                {
                method: "POST",
                body: JSON.stringify({ username: cookie.username }),
                }
            );
            data = await response.json();

            return data.data;
        } else {
            throw new Error("No cookie found");
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }  
}   


export async function deleteNotification(notification: any) {
    var data;
    try {
        const cookie = await cookieGet(process.env.SESSION_NAME!);
        if (cookie) {
            const response = await fetch(
                process.env.BASE_URL + "api/modify-notifications",
                {
                method: "POST",
                body: JSON.stringify({ username: cookie.username,  notification: JSON.stringify(notification), remove: true }),
                }
            );
            data = await response.json();

            return data.data;
        } else {
            throw new Error("No cookie found");
        }
    }
    catch (e) {
        console.error(e);
        return null;
    } 
}

export async function notifyUser(username: string, type: string, id: string) {
    var data;
    try {
        const cookie = await cookieGet(process.env.SESSION_NAME!);
        if (cookie) {
            var notification = {
                time: new Date().toISOString(),
                sender: cookie.username,
                type: type,
                id: id,
                stack: 1,
            };

            const response = await fetch(
                process.env.BASE_URL + "api/modify-notifications",
                {
                method: "POST",
                body: JSON.stringify({ username: username, notification: JSON.stringify(notification), remove: false}),
                }
            );
            data = await response.json();

            return data.data;
        } else {
            throw new Error("No cookie found");
        }
    }
    catch (e) {
        console.error(e);
        return null;
    } 
}
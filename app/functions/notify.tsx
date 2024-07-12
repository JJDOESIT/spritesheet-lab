"use server";
import { cookieGet } from "./cookies";
import { getYYMMDDHH, timeDifference } from "./timeFunctions";


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


export async function deleteNotification(notification: string) {
    var data;
    try {
        const cookie = await cookieGet(process.env.SESSION_NAME!);
        if (cookie) {
            const response = await fetch(
                process.env.BASE_URL + "api/modify-notifications",
                {
                method: "POST",
                body: JSON.stringify({ username: cookie.username,  notification: notification, remove: true }),
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
    console.log("Notifying user");
    var data;
    try {
        const cookie = await cookieGet(process.env.SESSION_NAME!);
        if (cookie) {
            var notification = cookie.username + "|" + type + "|" + getYYMMDDHH() + "|" + id;

            const response = await fetch(
                process.env.BASE_URL + "api/modify-notifications",
                {
                method: "POST",
                body: JSON.stringify({ username: username, notification: notification, remove: false}),
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
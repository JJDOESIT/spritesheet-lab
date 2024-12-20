"use server";
import { cookieGet } from "./cookies";
import { isAuthenticated } from "./cookies";

export async function getNotifications() {
  var data;
  try {
    const cookie = await cookieGet(process.env.SESSION_NAME!);
    if (cookie) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "api/get-notifications",
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
  } catch (e) {
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
        process.env.NEXT_PUBLIC_BASE_URL + "api/modify-notifications",
        {
          method: "POST",
          body: JSON.stringify({
            username: cookie.username,
            notification: JSON.stringify(notification),
            remove: true,
          }),
        }
      );
      data = await response.json();

      return data.data;
    } else {
      throw new Error("No cookie found");
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function notifyUser(username: string, type: string, id: string) {
  var data;
  try {
    // Fetch the current auth session
    var responseData: { auth: boolean; cookie: any } = await isAuthenticated(
      process.env.SESSION_NAME!
    );

    // If the user is authenticated
    if (responseData.auth && responseData.cookie) {
      var notification = {
        time: new Date().toISOString(),
        sender: responseData.cookie.username,
        type: type,
        id: id,
        stack: 1,
      };

      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "api/modify-notifications",
        {
          method: "POST",
          body: JSON.stringify({
            username: username,
            notification: JSON.stringify(notification),
            remove: false,
          }),
        }
      );
      data = await response.json();
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

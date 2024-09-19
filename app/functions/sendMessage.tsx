"use server";
import { cookieGet } from "./cookies";
import { notifyUser } from "./notify";

export default async function sendMessage(
  conversationID: string,
  message: string
) {
  console.log("ConversationID: " + conversationID);
  try {
    const cookie = await cookieGet(process.env.SESSION_NAME!);
    if (cookie) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "api/send-message",
        {
          method: "POST",
          body: JSON.stringify({
            username: cookie.username,
            conversationID: conversationID,
            message: message,
          }),
        }
      );
      var data = await response.json();
      if (data && data.users) {
        data.users.forEach((user: string) => {
          if (user !== cookie.username) {
            notifyUser(
              user,
              data.users.length == 2 ? "m" : "gc",
              conversationID
            );
          }
        });
      }
    } else {
      throw new Error("No cookie found");
    }
  } catch (e) {
    console.error(e);
  }
}

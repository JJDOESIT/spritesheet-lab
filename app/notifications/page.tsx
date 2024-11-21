"use client";

import ProfileDataContext from "@/app/functions/profileDataContext";
import { useEffect, useState, useContext } from "react";
import Notification from "../components/notification/notification";
import { deleteNotification, getNotifications } from "../functions/notify";
import { timeDifference } from "../functions/timeFunctions";
import LoadingIcon from "../components/loadingIcon/loadingIcon";

export default function Page() {
  const profileContext = useContext(ProfileDataContext);
  const [notifications, setNotifications] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queryNotifications();
  }, []);

  async function queryNotifications() {
    getNotifications().then((data) => {
      if (data) {
        setNotifications(data.reverse());
        setLoading(false);
      }
    });
  }

  // Function to remove a notification based on the id
  async function removeNotification(notification: string) {
    if (notifications) {
      setNotifications((prev) => {
        return prev.filter((n) => {
          return n["id"] != notification["id"];
        });
      });
    }
    await deleteNotification(notification);
    profileContext.refetchProfileCallback();
  }

  function convertNotificationData(notification: any) {
    var href: string;
    var text: string;
    if (notification.type == "m") {
      href = "/messages/" + notification.id;
      text =
        notification.sender +
        (notification.stack == 1
          ? " sent you a message."
          : ((" sent you " + notification.stack) as string) + " messages.");
    } else if (notification.type == "l") {
      href = "/post?post=" + notification.id;
      text = "Your post was liked by " + notification.sender + ".";
    } else if (notification.type == "gc") {
      href = "/messages/" + notification.id;
      text =
        notification.sender +
        (notification.stack == 1
          ? " sent a message in a group chat."
          : ((" sent " + notification.stack) as string) +
            " messages in a group chat.");
    } else {
      href = "/notifications/";
      text = "Test notification from " + notification.sender + ".";
    }

    return (
      <Notification
        username={notification.sender}
        href={href}
        text={text}
        time={timeDifference(new Date(notification.time))}
        type={notification.type}
        id={notification.id}
        removeCallback={(clear: boolean = true) => {
          removeNotification(notification);
        }}
      ></Notification>
    );
  }

  return (
    <>
      {!loading ? (
        <main className="flex flex-col items-center w-full h-full overflow-scroll hideScrollbar">
          <br></br>
          <div className="mx-[20%] mb-[20px] animate__animated animate__fadeIn roundedFormOppositeShadow">
            {notifications && !loading ? (
              notifications.length > 0 ? (
                notifications.map((notification: any, index: any) => {
                  return convertNotificationData(notification);
                })
              ) : (
                <div className="flex flex-col items-center justify-center w-[60vw]">
                  <p>You don't have any notifications yet.</p>
                  <p>
                    Come back later to see any likes, comments, or messages you
                    get!
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center w-[60vw] h-[70vh]">
                <LoadingIcon
                  time={1}
                  tileSize={100}
                  color="#000000"
                ></LoadingIcon>
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
        </div>
      )}
    </>
  );
}

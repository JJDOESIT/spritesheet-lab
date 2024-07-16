"use client";
import { useEffect, useState } from "react";
import Notification from "../components/notification/notification";
import { deleteNotification, getNotifications, notifyUser} from "../functions/notify";
import {timeDifference } from "../functions/timeFunctions";
import LoadingIcon from "../components/loadingIcon/loadingIcon";


export default function Page() {

    const [notifications, setNotifications] = useState<string[] | null>(null);
    
    useEffect(() => {
        queryNotifications();
    }, [])

    async function queryNotifications() {
        getNotifications().then((data) => {
            if (data) {
                setNotifications(data);
            }
        });
    }

    function removeNotification(notification: string) {
        if (notifications) {
            setNotifications(notifications.filter((item) => item !== notification));
        }
        deleteNotification(notification).then(() =>
        {
            queryNotifications();
        });
    }

    function convertNotificationData(notification: any) {
    
        var href: string
        var text: string
        if (notification.type == "m")
        {
            href = "/messages/" + notification.id;
            text = notification.sender + (notification.stack == 1 ? " sent you a message." : " sent you " + notification.stack as string + " messages.");
        }
        else if (notification.type == "l")
        {
            href = "/notifications/";
            text = "Your post was liked by " + notification.sender + ".";
        } 
        else
        {
            href = "/notifications/";
            text = "Test notification from " + notification.sender + ".";
        }
    
        return (
            <Notification username={notification.sender} href={href} text={text} time={timeDifference(new Date(notification.time))} removeCallback={() => {removeNotification(notification)}}></Notification>
        )
    }

    return (
        <main className="flex flex-col items-center w-full h-full overflow-scroll hideScrollbar">
            <br></br>
            <div className="mx-[20%] mb-[20px] animate__animated animate__fadeIn roundedFormOppositeShadow">
                {notifications ? 
                    notifications.length > 0 ?
                    notifications.reverse().map((notification: any, index: any) => 
                        {
                            return convertNotificationData(notification);
                        } 
                    )
                    :
                    <div className="flex flex-col items-center justify-center w-[60vw] h-[70vh]">
                        <p >You don't have any notifications yet.</p>
                        <p >Come back later to see any likes, comments, or messages you get!</p>
                    </div>
                :
                <div className="flex flex-col items-center justify-center w-[60vw] h-[70vh]">
                        <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
                </div>
                }   
            </div>
        </main>
    )
}
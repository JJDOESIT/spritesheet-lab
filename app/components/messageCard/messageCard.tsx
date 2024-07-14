'use client'

import getProfileData from "@/app/functions/getProfileData";
import ProfilePictureBubble from "../profilePictureBubble/profilePictureBubble";
import ProfileDataContext from "@/app/functions/profileDataContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import LoadingIcon from "../loadingIcon/loadingIcon";
import { usePathname } from "next/navigation";

export function MessageCard({userArray, conversationId} : {userArray: any[], conversationId: string}) {

    const profileData = useContext(ProfileDataContext);
    const userName = profileData.username;

    const pathname = usePathname();
    const selected = pathname.endsWith(conversationId);

    userArray = userArray.filter((user) => user.username != userName); 

    var userList = ""
    if (userArray.length > 1) {
        for (var i = 0; i < userArray.length; i++) {
            userList += userArray[i].username;
            if (i < userArray.length - 2) {
                userList += ", ";
            }
            else if (i == userArray.length - 2) {
                if (userArray.length == 2) {
                    userList += " and ";
                }
                else
                {
                    userList += ", and ";
                }
            }
        }
    }
    else if (userArray.length == 1) {
        userList = userArray[0].username;
    }
    else if (userArray.length == 1) {
        userList = userArray[0];
    }

    return (
        <Link href={`/messages/${conversationId}`} passHref legacyBehavior>
            <a>
                <div className={`w-[300px] h-[60px] flex flex-row items-center ${selected ? "bg-neonGreen" : "bg-white"} border-black border-[2px] rounded-[13px] m-[8px]`}>
                    <ProfilePictureBubble className="w-[40px] h-[40px]" backgroundColor="bg-black" profileImgSrc={userArray.length == 1 ? userArray[0].profile_image : "/group_chat.png"}/>
                    <p className="ml-[10px] text-sm">{userList}</p>
                </div>
            </a>
        </Link>
    )
}
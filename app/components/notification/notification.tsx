"use client";
import React, { useEffect, useState } from "react";
import ProfilePictureBubble from "../profilePictureBubble/profilePictureBubble";
import getProfileData from "@/app/functions/getProfileData";
import Link from "next/link";

export default function Notification({username, href, text, time, removeCallback} : {username: string, href: string, text: string, time: string, removeCallback: () => void}) {

    const [profilePicture, setProfilePicture] = useState<string>("");

    useEffect(() => {
        getProfileData(username).then((data) => {
        if (data){
            setProfilePicture(data.profile_image);
        }
        });
    }, []);

    return (
        <div className="w-[60vw] h-fit flex flex-row items-center my-3 border-t border border-black p-2 rounded-md" >
            <ProfilePictureBubble className="w-[70px] h-[70px]" backgroundColor="bg-black" profileImgSrc={profilePicture}></ProfilePictureBubble>
            <Link className="w-[90%] px-10" href={href}>
                <p>{time}</p>
                <p >{text}</p>
            </Link>
            <button onClick={removeCallback} className="text-2xl">X</button>
        </div>
    )
}
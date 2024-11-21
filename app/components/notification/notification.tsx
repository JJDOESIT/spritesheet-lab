"use client";

import React, { useEffect, useState } from "react";
import ProfilePictureBubble from "../profilePictureBubble/profilePictureBubble";
import getProfileData from "@/app/functions/getProfileData";
import Link from "next/link";
import { fetchPost } from "@/app/post/post.server";

export default function Notification({
  username,
  href,
  text,
  time,
  type,
  id,
  removeCallback,
}: {
  username: string;
  href: string;
  text: string;
  time: string;
  type: string;
  id: string;
  removeCallback: (arg0: boolean) => void;
}) {
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setImage = async (id) => {
      if (type === "l") {
        const data = await fetchPost(id);
        if (data && data["image"]) {
          setProfilePicture(data["image"][0]);
          setLoading(false);
        }
      } else {
        await getProfileData(username).then((data) => {
          if (data) {
            setProfilePicture(data.profile_image);
            setLoading(false);
          }
        });
      }
    };
    setImage(id);
  }, [username]);

  return (
    <>
      {loading ? (
        <div
          className={`flex w-[60vw] h-fit flex flex-row items-center my-3 border-t border border-black p-2 rounded-md justify-between md:flex-col`}
        >
          <div className="w-[69px] h-[69px] border border-black overflow-hidden bg-white rounded-full"></div>
          <div>
            <button className="text-2xl w-[50px] h-[50px] px-[20px] py-[15px] border border-black"></button>
          </div>
        </div>
      ) : (
        <div
          className={`w-[60vw] h-fit flex flex-row items-center my-3 border-t border border-black p-2 rounded-md flex max-md:flex-col`}
        >
          <ProfilePictureBubble
            className="w-[70px] h-[70px]"
            backgroundColor="bg-black"
            profileImgSrc={profilePicture}
          ></ProfilePictureBubble>
          <Link
            className="w-[90%] px-10"
            href={href}
            onClick={() => {
              removeCallback(true);
            }}
          >
            <p className="font-bold">{time}</p>
            <p>{text}</p>
          </Link>
          <button
            onClick={() => {
              removeCallback(false);
            }}
            className="text-2xl px-[20px] py-[15px] redBlackButton w-[50px] h-[50px]"
          >
            X
          </button>
        </div>
      )}
    </>
  );
}

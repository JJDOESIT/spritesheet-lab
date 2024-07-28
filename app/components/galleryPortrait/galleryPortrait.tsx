"use client";

import styles from "../galleryPortrait/galleryPortrait.module.css";
import { likePost, unlikePost } from "./galleryPortrait.server";
import { useState, useRef, useContext, useEffect } from "react";
import ProfileDataContext from "@/app/functions/profileDataContext";
import { HandThumbUpIcon as HandThumbUpIconSolid } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as HandThumbUpIconOutline } from "@heroicons/react/24/outline";
import Link from "next/link";

interface galleryPortraitPropTypes {
  title: string;
  image: any;
  id: string;
  likes: number;
  username: string | null;
  profile_image: string;
}

export default function GalleryPortrait(props: galleryPortraitPropTypes) {
  const profileData = useContext(ProfileDataContext);
  const [tempLike, setTempLike] = useState(false);
  const [overideTempLike, setOverideTempLike] = useState(false);
  const likeCountRef = useRef<HTMLParagraphElement>(null);

  // Like a post
  async function likeAPost(id: string) {
    setTempLike(true);
    setOverideTempLike(false);
    if (likeCountRef.current) {
      likeCountRef.current.innerHTML = (
        parseInt(likeCountRef.current.innerHTML) + 1
      ).toString();
    }
    await likePost(id);
  }

  // Unlike a post
  async function unlikeAPost(id: string) {
    setTempLike(false);
    setOverideTempLike(true);
    if (likeCountRef.current) {
      likeCountRef.current.innerHTML = (
        parseInt(likeCountRef.current.innerHTML) - 1
      ).toString();
    }
    await unlikePost(id);
  }

  return (
    <div
      className={`w-full h-full bg-white border-2 border-black ${styles.container}`}
      id={props.id}
    >
      <div className="w-full h-[80%]">
        <a href={"post?post=" + props.id}>
          <img
            src={props.image ? props.image : "/jjdoesit.png"}
            className="object-cover w-full h-full"
          ></img>
        </a>
      </div>
      <div className="flex justify-center max-h-[10%] items-center">
        <p>{props.title}</p>
      </div>
      <div className="flex h-[10%] justify-between">
        {
          // If a post has been liked or temp liked
          ((profileData.liked_posts &&
            props.id &&
            profileData.liked_posts.includes(props.id)) ||
            tempLike) &&
          !overideTempLike ? (
            <div className="flex items-center">
              <HandThumbUpIconSolid
                className={`h-full pl-[5px] ${styles.thumbsUpIcon}`}
                onClick={() => {
                  // Unlike the post and give temp feedback to the user
                  unlikeAPost(props.id);
                }}
              ></HandThumbUpIconSolid>
              <p className="pl-[5px]" ref={likeCountRef}>
                {props.likes}
              </p>
            </div>
          ) : (
            <div className="flex items-center">
              <HandThumbUpIconOutline
                className={`h-full pl-[5px] ${styles.thumbsUpIcon}`}
                onClick={() => {
                  // Like a post and give temp feedback to the user
                  likeAPost(props.id);
                }}
              ></HandThumbUpIconOutline>
              <p className="pl-[5px]" ref={likeCountRef}>
                {props.likes}
              </p>
            </div>
          )
        }
        <div className={`flex h-full}`}>
          <Link
            className="flex pr-[5px]"
            href={props.username ? "/profiles/" + props.username : "/gallery/"}
          >
            <img
              src={
                props.profile_image
                  ? props.profile_image
                  : "/blank-profile-picture.png"
              }
              className="w-full h-full rounded-[3em]"
            ></img>
          </Link>
        </div>
      </div>
    </div>
  );
}

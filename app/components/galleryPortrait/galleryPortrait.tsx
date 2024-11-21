"use client";

import styles from "../galleryPortrait/galleryPortrait.module.css";
import { likePost, unlikePost } from "./galleryPortrait.server";
import { useState, useRef, useContext, useEffect } from "react";
import getTimestampFromObjectId from "@/app/functions/getDateFromID";
import ProfileDataContext from "@/app/functions/profileDataContext";
import { HandThumbUpIcon as HandThumbUpIconSolid } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as HandThumbUpIconOutline } from "@heroicons/react/24/outline";
import Link from "next/link";

interface galleryPortraitPropTypes {
  title: string;
  images: any;
  id: string;
  likes: number;
  username: string | null;
  profile_image: string;
  speed: number;
}

export default function GalleryPortrait(props: galleryPortraitPropTypes) {
  const profileData = useContext(ProfileDataContext);
  const [tempLike, setTempLike] = useState(false);
  const [overideTempLike, setOverideTempLike] = useState(false);
  const likeCountRef = useRef<HTMLParagraphElement>(null);
  const [currentImage, setCurrentImage] = useState(null);

  // Set the current image on load
  useEffect(() => {
    setCurrentImage(props.images[0]);
    if (props.speed && props.speed != 0) {
      var imageIndex = 0;
      const interval = setInterval(() => {
        imageIndex = (imageIndex + 1) % props.images.length;
        setCurrentImage(props.images[imageIndex]);
      }, props.speed * 1000);
      // Cleanup the interval when images change or component unmounts
      return () => clearInterval(interval);
    }
    // Cleanup function when effect dependencies change or component unmounts
    return () => {};
  }, [props.images, props.speed]);

  // Like a post
  async function likeAPost(id: string, author: string) {
    setTempLike(true);
    setOverideTempLike(false);
    if (likeCountRef.current) {
      likeCountRef.current.innerHTML = (
        parseInt(likeCountRef.current.innerHTML) + 1
      ).toString();
    }
    await likePost(id, author);
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
        <a href={"/post?post=" + props.id}>
          <img
            src={currentImage ? currentImage : "/jjdoesit.png"}
            className="object-cover w-full h-full"
          ></img>
        </a>
      </div>
      <div className="flex justify-center max-h-[10%] items-center">
        <p className="font-bold">{props.title}</p>
      </div>
      <div className="flex h-[10%] justify-between">
        {profileData.username && profileData.username != "" ? (
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
                  profileData.refetchProfileCallback();
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
                  likeAPost(props.id, props.username);
                  profileData.refetchProfileCallback();
                }}
              ></HandThumbUpIconOutline>
              <p className="pl-[5px]" ref={likeCountRef}>
                {props.likes}
              </p>
            </div>
          )
        ) : (
          <div></div>
        )}
        <div className={`flex h-full`}>
          <p className="flex items-center">
            {getTimestampFromObjectId(props.id)}
          </p>
          <Link
            className="flex pr-[5px] pl-[5px] h-full items-start justify-start"
            href={props.username ? "/profiles/" + props.username : "/gallery/"}
          >
            <img
              src={
                props.profile_image
                  ? props.profile_image
                  : "/blank-profile-picture.png"
              }
              className="w-auto h-full rounded-[3em] object-cover"
              style={{ aspectRatio: 1 }} // Explicit aspect ratio if needed
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

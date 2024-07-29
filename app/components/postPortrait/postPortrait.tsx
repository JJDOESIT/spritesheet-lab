"use client";

import styles from "../postPortrait/postPortrait.module.css";
import {
  likePost,
  unlikePost,
} from "../galleryPortrait/galleryPortrait.server";
import { useState, useRef, useContext, useEffect } from "react";
import ProfileDataContext from "@/app/functions/profileDataContext";
import {
  HandThumbUpIcon as HandThumbUpIconSolid,
  PencilSquareIcon as PencilSquareIconSolid,
} from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as HandThumbUpIconOutline,
  PencilSquareIcon as PencilSquareIconOutline,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface postPortraitPropTypes {
  title: string;
  image: any;
  id: string;
  likes: number;
  username: string | null;
  profile_image: string;
  modifiable: boolean;
}

export default function PostPortrait(props: postPortraitPropTypes) {
  const profileData = useContext(ProfileDataContext);
  const [tempLike, setTempLike] = useState(false);
  const [overideTempLike, setOverideTempLike] = useState(false);
  const likeCountRef = useRef<HTMLParagraphElement>(null);
  const [isHoveringOverModify, setIsHoveringOverModify] = useState(false);
  const modifyButtonRef = useRef(null);
  const [fullscreenImageVisible, setFullscreenImageVisible] = useState(false);
  const postBackgroundRef = useRef<HTMLDivElement>(null);

  async function downloadImage() {
    const a = document.createElement("a");
    a.href = props.image;
    a.download = props.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

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
    <div className="flex h-[90%] w-[90%]" ref={postBackgroundRef}>
      {fullscreenImageVisible ? (
        <div className="relative w-full h-full overflow-scroll">
          <div
            className="absolute w-full h-full blur-2xl"
            style={{
              background: `url(${props.image})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>
          <img
            className="absolute transform -translate-x-1/2 left-1/2"
            src={props.image}
          ></img>
          <input
            type="button"
            value="x"
            className={`${styles.exitImageButton}`}
            onClick={() => {
              if (postBackgroundRef && postBackgroundRef.current) {
                postBackgroundRef.current.style.width = "90%";
                postBackgroundRef.current.style.height = "90%";
                setFullscreenImageVisible(false);
              }
            }}
          ></input>
        </div>
      ) : (
        <div
          className={`w-full h-full bg-white border-2 border-black ${styles.container}`}
          id={props.id}
        >
          <div className="w-full h-[70%]">
            <a>
              <img
                src={props.image ? props.image : "/jjdoesit.png"}
                className="w-full max-h-[100%]"
                onClick={() => {
                  if (postBackgroundRef && postBackgroundRef.current) {
                    postBackgroundRef.current.style.width = "100%";
                    postBackgroundRef.current.style.height = "100%";
                    setFullscreenImageVisible(true);
                  }
                }}
              ></img>
            </a>
          </div>
          <div className="flex justify-center max-h-[10%] items-center">
            <p>{props.title}</p>
          </div>
          <div className="flex h-[5%] justify-between">
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
              {props.modifiable ? (
                isHoveringOverModify ? (
                  <PencilSquareIconSolid
                    ref={modifyButtonRef}
                    className={`h-full pr-[5px] ${styles.modifyPost}`}
                    onMouseLeave={() => {
                      setIsHoveringOverModify(false);
                    }}
                  ></PencilSquareIconSolid>
                ) : (
                  <PencilSquareIconOutline
                    ref={modifyButtonRef}
                    className={`h-full pr-[5px] ${styles.modifyPost}`}
                    onMouseEnter={() => {
                      setIsHoveringOverModify(true);
                    }}
                  ></PencilSquareIconOutline>
                )
              ) : (
                <></>
              )}
              <Link
                className="flex pr-[5px]"
                href={
                  props.username ? "/profiles/" + props.username : "/gallery/"
                }
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
          <div className="flex h-[15%] justify-center">
            <input
              type="button"
              value="Download"
              onClick={() => {
                downloadImage();
              }}
              className={`${styles.downloadButton}`}
            ></input>
          </div>
        </div>
      )}
    </div>
  );
}

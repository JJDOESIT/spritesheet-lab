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
  TrashIcon as TrashIconSolid,
  ArrowLeftCircleIcon as ArrowLeftSolid,
} from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as HandThumbUpIconOutline,
  TrashIcon as TrashIconOutline,
  ArrowLeftCircleIcon as ArrowLeftOutline,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import deletePost from "@/app/functions/deletePost";
import getTimestampFromObjectId from "@/app/functions/getDateFromID";

interface postPortraitPropTypes {
  title: string;
  images: any;
  id: string;
  likes: number;
  username: string | null;
  profile_image: string;
  modifiable: boolean;
  speed: number;
}

export default function PostPortrait(props: postPortraitPropTypes) {
  const profileData = useContext(ProfileDataContext);
  const [tempLike, setTempLike] = useState(false);
  const [overideTempLike, setOverideTempLike] = useState(false);
  const likeCountRef = useRef<HTMLParagraphElement>(null);
  const [isHoveringOverDelete, setisHoveringOverDelete] = useState(false);
  const [isHoveringOverBack, setisHoveringOverBack] = useState(false);
  const modifyButtonRef = useRef(null);
  const [fullscreenImageVisible, setFullscreenImageVisible] = useState(false);
  const postBackgroundRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [deletePostConfirmation, setDeletePostConfirmation] = useState(false);

  // Function to download an image
  async function downloadImage() {
    for (let index = 0; index < props.images.length; index++) {
      const a = document.createElement("a");
      a.href = props.images[index];
      a.download = props.title + index;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

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

  // Set the current image on load
  useEffect(() => {
    setCurrentImage(props.images[0]);
    if (props.speed && props.speed != 0) {
      var imageIndex = 0;
      setInterval(() => {
        imageIndex = (imageIndex + 1) % props.images.length;
        setCurrentImage(props.images[imageIndex]);
      }, props.speed * 1000);
    }
  }, []);

  return (
    <div className="flex h-[90%] w-[90%]" ref={postBackgroundRef}>
      {fullscreenImageVisible ? (
        <div className={`relative w-full h-full overflow-scroll`}>
          <div
            className="absolute w-full h-full blur-2xl"
            style={{
              background: `url(${props.images})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>
          <img
            className={`absolute transform -translate-x-1/2 left-1/2 ${styles.imagePopupContainer}`}
            src={currentImage!}
          ></img>
          {isHoveringOverBack ? (
            <ArrowLeftSolid
              className={`${styles.exitImageButton}`}
              onClick={() => {
                if (postBackgroundRef && postBackgroundRef.current) {
                  postBackgroundRef.current.style.width = "90%";
                  postBackgroundRef.current.style.height = "90%";
                  setFullscreenImageVisible(false);
                  setisHoveringOverBack(false);
                }
              }}
              onMouseLeave={() => {
                setisHoveringOverBack(false);
              }}
            ></ArrowLeftSolid>
          ) : (
            <ArrowLeftOutline
              className={`${styles.exitImageButton}`}
              onMouseEnter={() => {
                setisHoveringOverBack(true);
              }}
            ></ArrowLeftOutline>
          )}
        </div>
      ) : (
        <div
          className={`w-full h-full bg-white border-2 border-black ${styles.container}`}
          id={props.id}
        >
          <div className="w-full h-[70%]">
            <a>
              <img
                src={currentImage ? currentImage : "/jjdoesit.png"}
                className={`w-full max-h-[100%] ${styles.postImage}`}
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
            <p className="font-bold">{props.title}</p>
          </div>
          <div className="flex h-[5%] justify-between">
            {profileData.username && profileData.username != "" ? (
              // If a post has been liked or temp liked
              ((profileData.liked_posts &&
                props.id &&
                profileData.liked_posts.includes(props.id)) ||
                tempLike) &&
              !overideTempLike ? (
                <div className="flex items-center w-[50%] justify-start">
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
                <div className="flex items-center w-[50%] justify-start">
                  <HandThumbUpIconOutline
                    className={`h-full pl-[5px] ${styles.thumbsUpIcon}`}
                    onClick={() => {
                      // Like a post and give temp feedback to the user
                      likeAPost(props.id, props.username);
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
            <div className={`flex h-full w-[50%] justify-end`}>
              {props.modifiable ? (
                isHoveringOverDelete ? (
                  <TrashIconSolid
                    ref={modifyButtonRef}
                    className={`h-full pr-[5px] ${styles.modifyPost}`}
                    onMouseLeave={() => {
                      setisHoveringOverDelete(false);
                    }}
                    onClick={() => {
                      setDeletePostConfirmation(true);
                    }}
                  ></TrashIconSolid>
                ) : (
                  <TrashIconOutline
                    ref={modifyButtonRef}
                    className={`h-full pr-[5px] ${styles.modifyPost}`}
                    onMouseEnter={() => {
                      setisHoveringOverDelete(true);
                    }}
                  ></TrashIconOutline>
                )
              ) : (
                <></>
              )}
              <p className="flex items-center">
                {getTimestampFromObjectId(props.id)}
              </p>
              <Link
                className="flex pr-[5px] pl-[5px] h-full"
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
                  className="w-auto h-full rounded-[3em]"
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
      <div
        className={`${styles.deletePostConfirmation}`}
        style={deletePostConfirmation ? {} : { opacity: 0 }}
      >
        <p className="font-bold">Delete this post?</p>
        <div className="flex justify-around">
          <div
            onClick={() => {
              setDeletePostConfirmation(false);
            }}
          >
            No
          </div>
          <div
            onClick={async () => {
              await deletePost(props.username!, props.id);
              window.location.reload();
            }}
          >
            Yes
          </div>
        </div>
      </div>
    </div>
  );
}

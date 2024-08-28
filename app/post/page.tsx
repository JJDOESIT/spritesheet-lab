"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPost } from "./post.server";
import LoadingIcon from "../components/loadingIcon/loadingIcon";
import ProfileDataContext from "../functions/profileDataContext";
import PostPortrait from "../components/postPortrait/postPortrait";

export default function Post() {
  // Global profile data
  const profileData = useContext(ProfileDataContext);
  // Url params
  const searchParams = useSearchParams();
  // Allow page to load
  const [pageLoaded, setPageLoaded] = useState(false);
  // Post ID
  const [postID, setPostID] = useState("");
  // Post data
  const [postData, setPostData] = useState({
    title: "",
    image: "",
    _id: "",
    likes: 0,
    username: "",
    profile_image: "",
  });

  // Fetch the post ID from the url params
  useEffect(() => {
    const id = searchParams.get("post");
    if (id) {
      setPostID(id);
    }
  }, []);

  // Function to fetch the post
  async function getPost() {
    const data = await fetchPost(postID);
    if (data) {
      setPostData(data);
      setPageLoaded(true);
    }
  }

  // Fetch the post once the postID has been set from the URL params
  useEffect(() => {
    if (postID) {
      getPost();
    }
  }, [postID]);

  return (
    <>
      {pageLoaded ? (
        <div className="flex w-full h-full">
          <div className="flex items-center justify-center w-full h-full">
            <PostPortrait
              title={postData.title}
              image={postData.image}
              id={postData._id}
              likes={postData.likes}
              username={postData.username}
              profile_image={postData.profile_image}
              modifiable={postData.username === profileData.username}
            ></PostPortrait>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
        </div>
      )}
    </>
  );
}

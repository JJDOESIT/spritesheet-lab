"use client";

import { useState, useEffect } from "react";
import styles from "../settings/settings.module.css";
import ProfilePicture from "../components/profilePicture/profilePicture";
import UploadImage from "../components/uploadImage/uploadImage";
import getProfileData from "../functions/getProfileData";
import LoadingIcon from "../components/loadingIcon/loadingIcon";

export default function Settings() {
  const [profileData, setProfileData] = useState({
    profile_image: "/blank-profile-picture.png",
    username: "",
    name: "",
    bio: "",
  });
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Fetch the profile data
  async function getProfile() {
    const data = await getProfileData();
    if (data) {
      console.log(data);
      setProfileData(data);
    }
    setProfileLoaded(true);
  }

  // On render, fetch the profile data
  useEffect(() => {
    getProfile();
  }, []);

  // Once the profile is loaded, set the pageLoaded to be true
  useEffect(() => {
    if (profileLoaded) {
      setPageLoaded(true);
    }
  }, [profileLoaded]);

  return (
    <>
      {pageLoaded ? (
        <div
          className={`flex w-full h-full justify-center pl-[10px] pr-[10px] ${styles.pageContainer}`}
        >
          <div className="flex flex-col">
            <ProfilePicture
              profileImgPath={profileData["profile_image"]}
              username="jjdoesit"
              className="m-4"
              backgroundColor="bg-black"
              textColor="text-black"
            />
            <UploadImage
              collection="profiles"
              field="profile_image"
            ></UploadImage>
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

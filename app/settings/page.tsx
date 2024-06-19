"use client";

import { useState, useEffect } from "react";
import styles from "../settings/settings.module.css";
import createAlert from "../functions/createAlert";
import ProfilePicture from "../components/profilePicture/profilePicture";
import UploadImage from "../components/uploadImage/uploadImage";
import getProfileData from "../functions/getProfileData";
import LoadingIcon from "../components/loadingIcon/loadingIcon";
import { create } from "domain";
import Alert from "../components/alert/alert";

export default function Settings() {
  const [profileData, setProfileData] = useState({
    profile_image: "/blank-profile-picture.png",
    username: "",
    name: "",
    bio: "",
  });
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [imageAlertData, setImageAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });

  // Fetch the profile data
  async function getProfile() {
    const data = await getProfileData();
    if (data) {
      setProfileData(data);
    }
    setProfileLoaded(true);
  }

  // Image alert callback
  function imageAlertCallback(status: number) {
    if (status == 200) {
      setImageAlertData(
        createAlert({
          type: "success",
          message: "Image Uploaded. Please refresh.",
          hidden: false,
          maxWidth: 305,
        })
      );
    }
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
              username={profileData["username"]}
              className="m-4"
              backgroundColor="bg-black"
              textColor="text-black"
            />
            <UploadImage
              collection="profiles"
              field="profile_image"
              callback={imageAlertCallback}
            ></UploadImage>
            <Alert
              hidden={imageAlertData["hidden"]}
              message={imageAlertData["message"]}
              borderColor={imageAlertData["borderColor"]}
              backgroundColor={imageAlertData["backgroundColor"]}
              fontColor={imageAlertData["fontColor"]}
              maxWidth={imageAlertData["maxWidth"]}
              toggleHidden={() =>
                setImageAlertData((prev) => {
                  return { ...prev, hidden: true };
                })
              }
            ></Alert>
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

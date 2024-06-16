"use client";

import { useState, useEffect } from "react";
import ProfilePicture from "../components/profilePicture/profilePicture";
import UploadImage from "../components/uploadImage/uploadImage";
import getProfileData from "../functions/getProfileData";

export default function Settings() {
  const [profilePath, setProfilePath] = useState("");

  async function getProfile() {
    const data = await getProfileData();
    if (data) {
      if (data.profile_image != null) {
        setProfilePath(data.profile_image);
      } else {
        setProfilePath("/blank-profile-picture.png");
      }
    }
  }
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <div className="flex w-[200px] h-fit flex-col">
        <ProfilePicture
          profileImgPath={profilePath}
          username="jjdoesit"
          className="m-4"
        />
        <UploadImage collection="profiles" field="profile_image"></UploadImage>
      </div>
    </>
  );
}

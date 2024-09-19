"use client";

import Gallery from "@/app/components/gallery/gallery";
import ProfilePictureBubble from "@/app/components/profilePictureBubble/profilePictureBubble";
import getProfileData, { ProfileData } from "@/app/functions/getProfileData";
import { useEffect, useState } from "react";
import LoadingIcon from "@/app/components/loadingIcon/loadingIcon";
import styles from "../profiles.module.css";

interface PageProps {
  params: {
    username: string;
  };
}

export default function Page({ params }: PageProps) {
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    profile_image: "" as string,
    username: "This user does not exist." as string,
    name: null as string | null,
    bio: " " as string | null,
    liked_posts: [] as Array<string>,
  });

  useEffect(() => {
    getProfileData(params.username).then((data) => {
      if (data) {
        setProfileData(data);
      }
      setProfileLoaded(true);
    });
  }, []);

  return profileLoaded ? (
    <main
      className={`flex flex-row items-center w-full h-full overflow-scroll ${styles.container}`}
    >
      <div className="h-full w-[50%]">
        <div
          className={`w-full ${styles.profileBox} flex flex-col md:flex-row items-center`}
        >
          <ProfilePictureBubble
            backgroundColor="bg-black"
            profileImgSrc={
              profileData.profile_image
                ? profileData.profile_image
                : "/blank-profile-picture.png"
            }
            className="w-[250px] h-[250px]"
          ></ProfilePictureBubble>
          <div className="flex flex-col items-start justify-startw-[90%] md:w-[50%] flex-grow p-[20px]">
            <h1 className="text-2xl md:text-4xl">
              <strong>{profileData.username}</strong>
            </h1>
            <p className="text-xl md:text-2xl my-[10px]">
              <strong>{profileData.name}</strong>
            </p>
            <p className="text-sm md:text-base">
              {profileData.bio
                ? profileData.bio
                : profileData.username + " hasn't written a bio yet."}
            </p>
          </div>
        </div>
      </div>
      <div className="w-[50%] h-full">
        <div className="flex justify-center pt-[20px]">
          <p className="text-xl font-bold">Sheets</p>
        </div>
        <Gallery
          searchInput={profileData.username}
          searchRefresh={null}
          searchType={"USER"}
          sortType={"BEST"}
        ></Gallery>
      </div>
    </main>
  ) : (
    <div className="flex items-center justify-center w-full h-full">
      <LoadingIcon
        time={1}
        tileSize={100}
        color="#000000"
        className=""
      ></LoadingIcon>
    </div>
  );
}

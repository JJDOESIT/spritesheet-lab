"use client";

import "@/app/global.css";
import "animate.css/animate.min.css";
import { redditMono } from "@/app/components/fonts/fonts";
import { useState, useEffect } from "react";
import getProfileData from "./functions/getProfileData";
import ProfileDataContext from "./functions/profileDataContext";
import Navbar from "./components/navbar/navbar";
import SideNav from "./components/sidenav/sidenav";
import LoadingIcon from "./components/loadingIcon/loadingIcon";
import styles from "@/app/layout.module.css";
import bgStyles from "@/app/home/home.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileData, setProfileData] = useState({
    profile_image: "/blank-profile-picture.png" as string,
    username: "" as string,
    name: "" as string | null,
    bio: "" as string | null,
    liked_posts: [] as Array<string>,
    refetchProfileCallback: () => {
      console.log("Error: Refetch Profile Function Not Implemented ...");
    },
  });
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [refetchProfile, setRefetchProfile] = useState(false);

  // Trigger refresh of the profile data
  function fetchProfile() {
    setRefetchProfile((prev) => {
      return !prev;
    });
  }

  // Fetch the profile data
  async function getProfile() {
    const data = await getProfileData();
    if (data) {
      // Include refetchProfileCallback in the new data to ensure it's not lost
      setProfileData((prevData) => ({
        ...prevData,
        ...data,
        refetchProfileCallback: fetchProfile,
      }));
    } else {
      setProfileData((prevData) => ({
        ...prevData,
        refetchProfileCallback: fetchProfile,
      }));
    }
    setProfileLoaded(true);
  }

  // Fetch the profile data each refresh
  useEffect(() => {
    getProfile();
  }, [refetchProfile]);

  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${redditMono.className} antialiased overflow-x-hidden`}>
        {profileLoaded ? (
          <ProfileDataContext.Provider value={profileData}>
            <Navbar />
            <div
              className={`${styles.heightWithoutTopNav} flex flex-row w-full relative overflow-hidden  ${bgStyles.homeBG}`}
            >
              {children}
              <SideNav />
            </div>{" "}
          </ProfileDataContext.Provider>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
          </div>
        )}
      </body>
    </html>
  );
}

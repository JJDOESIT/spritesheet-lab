"use client";

import "@/app/global.css";
import "animate.css/animate.min.css";
import { redditMono } from "@/app/components/fonts/fonts";
import { useState, useEffect, useContext } from "react";
import getProfileData from "./functions/getProfileData";
import ProfileDataContext from "./functions/profileDataContext";
import Navbar from "./components/navbar/navbar";
import SideNav from "./components/sidenav/sidenav";
import LoadingIcon from "./components/loadingIcon/loadingIcon";
import styles from "@/app/layout.module.css";
import bgStyles from "@/app/home/home.module.css";
import { profile } from "console";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileData, setProfileData] = useState({
    profile_image: "/blank-profile-picture.png",
    username: "",
    name: "",
    bio: "",
  });
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Fetch the profile data
  async function getProfile() {
    const data = await getProfileData();
    if (data) {
      setProfileData(data);
    }
    setProfileLoaded(true);
  }

  // Fetch the profile data each refresh
  useEffect(() => {
    const data = getProfile();
  }, []);

  return (
    <html lang="en">
      <body className={`${redditMono.className} antialiased`}>
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

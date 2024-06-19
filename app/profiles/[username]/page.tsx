"use client";

import ProfilePictureBubble from "@/app/components/profilePictureBubble/profilePictureBubble";
import getProfileData, { ProfileData } from "@/app/functions/getProfileData";
import { useEffect, useState} from "react";
import LoadingIcon from "@/app/components/loadingIcon/loadingIcon";
import styles from "../profiles.module.css";

interface PageProps {
  params: {
    username: string;
  };
}

export default function Page({ params }: PageProps){
  const [profileLoaded, setProfileLoaded] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    profile_image: "/blank-profile-picture.png",
    username: "This user does not exist.",
    name: "",
    bio: ""
    // name: "Real Name",
    // bio: "Example bio to see if the formatting looks ok. This is a test of the bio formatting. This is only a test. If this were a real bio, you would be reading something else. Thank you for your time. Have a great day! - The Management Team of Example Bio Inc. 2021. All rights reserved. We are not responsible for any damages caused by reading this bio. Please consult a doctor if you experience any of the following symptoms: headache, nausea, dizziness, or fatigue. This bio is not intended to diagnose, treat, cure, or prevent any disease. Please consult a doctor before reading any bio. This bio is not intended for children under the age of 18. Please consult a doctor before reading this bio. This bio is not intended for pregnant individuals.",
  });


  useEffect(() => {
    console.log(params.username);
    getProfileData(params.username).then((data) => {
      console.log(data);
      if (data) {
        setProfileData(data);
      }
      setProfileLoaded(true);
    });
  }, []);


  return (profileLoaded ?
    <main className="flex flex-col items-center w-full h-full overflow-scroll">
      <div className={`w-[90%] ${styles.profileBox} flex flex-col md:flex-row items-center`}>
        <ProfilePictureBubble backgroundColor="bg-black" profileImgSrc={profileData.profile_image} className="w-[300px] h-[300px]"></ProfilePictureBubble>
        <div className="flex flex-col items-start justify-startw-[90%] md:w-[50%] flex-grow p-[20px]">
          <h1 className="text-2xl md:text-4xl"><strong>{profileData.username}</strong></h1>
          <p className="text-xl md:text-2xl my-[10px]"><strong>{profileData.name}</strong></p>
          <p className="text-sm md:text-base">{profileData.bio  == "" ? profileData.bio : profileData.username + " hasn't written a bio yet." }</p>
        </div>
      </div>
      <div className="w-[90%]"></div>
    </main> 
    :
    <div className="flex items-center justify-center w-full h-full">
      <LoadingIcon time={1} tileSize={100} color="#000000" className=""></LoadingIcon>
    </div>
  );
}
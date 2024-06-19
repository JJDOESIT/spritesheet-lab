"use client";

import Logo from "../logo/logo";
import { AdjustmentsHorizontalIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import ProfileDataContext from "@/app/functions/profileDataContext";
import { useContext } from "react";
import ProfilePictureBubble from "../profilePictureBubble/profilePictureBubble";

export default function Navbar() {
  const profileData = useContext(ProfileDataContext);

  const loginButton = <Link className="text-lg blackButton" href="/login">Login</Link>;


  return (
    <div className="h-[100px] bg-[black] flex md:flex-row flex-col items-center justify-between">
      <div className="mt-[10px]">
        <Logo />
      </div>
      <div className="flex flex-row items-center text-white md:w-[60%] w-[100%] md:justify-end justify-between space-x-[15px] px-[15px]">
        <p>Search Bar Representative</p>
        {profileData.username ? 
          <>
            <a href={`/profiles/${profileData.username}`}>
              <ProfilePictureBubble profileImgSrc={profileData.profile_image} backgroundColor={"bg-[#FFFFFF]"} className="w-[55px] h-[55px]"></ProfilePictureBubble>
            </a>
            
            <button id="NavbarButton"><AdjustmentsHorizontalIcon className="h-[40px] w-[40px]"/></button></>
          : loginButton
        }
      </div>
    </div>
  );
}

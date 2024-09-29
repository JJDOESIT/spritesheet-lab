"use client";

import Logo from "../logo/logo";
import {
  AdjustmentsHorizontalIcon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import ProfileDataContext from "@/app/functions/profileDataContext";
import styles from "../navbar/navbar.module.css";
import { useState, useContext } from "react";

export default function Navbar() {
  const profileData = useContext(ProfileDataContext);
  const [sideBarOpen, setSidebarOpen] = useState(false);

  const loginButton = (
    <Link className="text-lg blackButton" href="/login">
      Login
    </Link>
  );

  return (
    <div className="h-[100px] bg-[black] flex md:flex-row flex-col items-center justify-between p-[10px]">
      <div>
        <Logo />
      </div>
      <div className="flex flex-row items-center text-white md:w-[60%] w-[100%] md:justify-end justify-between space-x-[15px] px-[15px]">
        <Link href="/gallery/" className={`${styles.galleryLink}`}>
          Gallery
        </Link>
        {profileData.username ? (
          <>
            {!sideBarOpen ? (
              <button id="NavbarButton">
                <AdjustmentsHorizontalIcon
                  className="h-[40px] w-[40px]"
                  onClick={() => {
                    setSidebarOpen(true);
                  }}
                />
              </button>
            ) : (
              <button id="NavbarButton">
                <AdjustmentsVerticalIcon
                  className="h-[40px] w-[40px]"
                  onClick={() => {
                    setSidebarOpen(false);
                  }}
                ></AdjustmentsVerticalIcon>
              </button>
            )}
          </>
        ) : (
          loginButton
        )}
      </div>
    </div>
  );
}

"use client";

import styles from "../sidenav/sidenav.module.css";
import ProfilePicture from "@/app/components/profilePicture/profilePicture";
import logout from "@/app/functions/logout";
import Link from "next/link";
import { useRef, useEffect, useState, useContext } from "react";
import {
  ArrowUpCircleIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftEndOnRectangleIcon,
  BellIcon,
  BuildingStorefrontIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import getProfileData from "@/app/functions/getProfileData";
import ProfileDataContext from "@/app/functions/profileDataContext";

export default function SideNav() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null!);

  const profileData = useContext(ProfileDataContext);

  const [translateX, setTranslateX] = useState("250px");

  const handleClick = () => {
    setTranslateX((prev) => {
      return prev === "0px" ? "250px" : "0px";
    });
  };

  // Add event handler to navbar button
  useEffect(() => {
    const navbarButton = document.getElementById("NavbarButton");

    if (navbarButton) {
      navbarButton.addEventListener("click", handleClick);
    }

    return () => {
      if (navbarButton) {
        navbarButton.removeEventListener("click", handleClick);
      }
    };
  }, []);

  async function getProfile() {
    const data = await getProfileData();
    if (data) {
    }
  }

  // Check auth and fetch profile picture if logged in
  useEffect(() => {
    getProfile();
  }, []);

  // Handle logout
  async function handleLogout() {
    try {
      const status = await logout();
      if (status == 200) {
        await router.push("/login");
        await router.refresh();
        location.replace("/login");
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div
      ref={containerRef}
      style={{ transform: `translateX(${translateX})` }}
      className={`p-4 h-[100%] flex-none w-[250px] bg-black block absolute right-0 overflow-y-scroll ${styles.noScrollbar} ${styles.sideNav}`}
    >
      <a href={`/profiles/${profileData.username}`}>
        <ProfilePicture
          profileImgSrc={profileData.profile_image}
          username={profileData.username}
          className="m-4"
        />
      </a>

      <div className={styles.sideNavBar}>Tools</div>

      <Link
        href={"/gallery"}
        className={`neonBlackButton text-sm ${styles.sideNavButton}`}
      >
        <BuildingStorefrontIcon className={styles.sideNavButtonIcon} />
        Gallery
      </Link>
      <Link
        href={"/upload"}
        className={`neonBlackButton text-sm ${styles.sideNavButton}`}
      >
        <ArrowUpCircleIcon className={styles.sideNavButtonIcon} />
        Upload
      </Link>

      <div className={styles.sideNavBar}>Social</div>

      <Link
        href={"/notifications"}
        className={`neonBlackButton text-sm ${styles.sideNavButton} `}
        onClick={handleClick}
      >
        <BellIcon className={styles.sideNavButtonIcon} />
        Notifications
      </Link>
      <Link
        href={"/messages"}
        onClick={handleClick}
        className={`neonBlackButton text-sm ${styles.sideNavButton}`}
      >
        <ChatBubbleLeftRightIcon className={styles.sideNavButtonIcon} />
        Messages
      </Link>

      <div className={styles.sideNavBar}>Info</div>

      <Link
        href={"/licensing-tos"}
        onClick={handleClick}
        className={`neonBlackButton text-sm ${styles.sideNavButton}`}
      >
        <DocumentTextIcon className={styles.sideNavButtonIcon} />
        Licensing & TOS
      </Link>
      <Link href={"/about"} className={`neonBlackButton text-sm ${styles.sideNavButton}`}>
        <QuestionMarkCircleIcon className={styles.sideNavButtonIcon} />
        About us
      </Link>
      <Link
        href={"/contact"}
        onClick={handleClick}
        className={`neonBlackButton text-sm ${styles.sideNavButton}`}
      >
        <EnvelopeIcon className={styles.sideNavButtonIcon} />
        Contact us
      </Link>

      <div className={styles.sideNavBar}>Account</div>

      <Link
        href={"/settings"}
        onClick={handleClick}
        className={`neonBlackButton text-sm ${styles.sideNavButton}`}
      >
        <HandThumbUpIcon className={styles.sideNavButtonIcon} />
        Liked Sheets
      </Link>

      <Link
        href={"/settings"}
        onClick={handleClick}
        className={`neonBlackButton text-sm ${styles.sideNavButton}`}
      >
        <Cog6ToothIcon className={styles.sideNavButtonIcon} />
        Settings
      </Link>
      <a
        href={"#"}
        className={`neonBlackButton text-sm ${styles.sideNavButton}`}
        onClick={() => {
          handleClick();
          handleLogout();
        }}
      >
        <ArrowLeftEndOnRectangleIcon className={styles.sideNavButtonIcon} />
        Log out
      </a>
    </div>
  );
}

"use client";

import styles from "../sidenav/sidenav.module.css";
import ProfilePicture from "@/app/components/profilePicture/profilePicture";
import logout from "@/app/functions/logout";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
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
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import getProfileData from "@/app/functions/getProfileData";

export default function SideNav() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null!);

  const [translateX, setTranslateX] = useState("250px");

  // Add event handler to navabr button
  useEffect(() => {
    const navbarButton = document.getElementById("NavbarButton");

    const handleClick = () => {
      setTranslateX((prev) => {
        return prev === "0px" ? "250px" : "0px";
      });
    };

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
      <ProfilePicture
        profileImgPath="/jjdoesit.png"
        username="jjdoesit"
        className="m-4"
      />

      <div className={styles.sideNavBar}>Tools</div>

      <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}>
        <BuildingStorefrontIcon className={styles.sideNavButtonIcon} />
        Workshop
      </Link>
      <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}>
        <ArrowUpCircleIcon className={styles.sideNavButtonIcon} />
        Upload
      </Link>

      <div className={styles.sideNavBar}>Social</div>

      <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}>
        <BellIcon className={styles.sideNavButtonIcon} />
        Notifications
      </Link>
      <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}>
        <ChatBubbleLeftRightIcon className={styles.sideNavButtonIcon} />
        Messages
      </Link>

      <div className={styles.sideNavBar}>Info</div>

      <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}>
        <DocumentTextIcon className={styles.sideNavButtonIcon} />
        Licensing
      </Link>
      <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}>
        <QuestionMarkCircleIcon className={styles.sideNavButtonIcon} />
        About us
      </Link>
      <Link
        href={"/contact"}
        className={`neonBlackButton ${styles.sideNavButton}`}
      >
        <EnvelopeIcon className={styles.sideNavButtonIcon} />
        Contact us
      </Link>

      <div className={styles.sideNavBar}>Account</div>

      <Link
        href={"/settings"}
        className={`neonBlackButton ${styles.sideNavButton}`}
      >
        <Cog6ToothIcon className={styles.sideNavButtonIcon} />
        Settings
      </Link>
      <a
        href={"#"}
        className={`neonBlackButton ${styles.sideNavButton}`}
        onClick={() => handleLogout()}
      >
        <ArrowLeftEndOnRectangleIcon className={styles.sideNavButtonIcon} />
        Log out
      </a>
    </div>
  );
}

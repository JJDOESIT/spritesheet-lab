"use client";

import styles from "../sidenav/sidenav.module.css";
import { useRef, useEffect, useState} from "react";
import ProfilePicture from "@/app/components/profilePicture/profilePicture";
import {  ArrowUpCircleIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon,ArrowLeftEndOnRectangleIcon, BellIcon, BuildingStorefrontIcon, QuestionMarkCircleIcon,DocumentTextIcon, EnvelopeIcon} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SideNav() {
  const containerRef = useRef<HTMLDivElement>(null!);

  const [translateX, setTranslateX] = useState("250px");

  const handleClick = () => {
    setTranslateX((prev) => {
      return prev === "0px" ? "250px" : "0px";
    });
  };

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


  return (
    <div
      ref={containerRef}
      style={{ transform: `translateX(${translateX})` }}
      className={`p-4 h-[100%] flex-none w-[250px] bg-black block absolute right-0 overflow-y-scroll ${styles.noScrollbar} ${styles.sideNav}`}
    >
    <ProfilePicture profileImgPath="/jjdoesit.png" username="jjdoesit" className="m-4" />

    <div className={styles.sideNavBar}>Tools</div>

    <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}><BuildingStorefrontIcon className={styles.sideNavButtonIcon}/>Workshop</Link>
    <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}><ArrowUpCircleIcon className={styles.sideNavButtonIcon}/>Upload</Link>

    <div className={styles.sideNavBar}>Social</div>
    
    <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}><BellIcon className={styles.sideNavButtonIcon}/>Notifications</Link>
    <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}><ChatBubbleLeftRightIcon className={styles.sideNavButtonIcon}/>Messages</Link>
    
    <div className={styles.sideNavBar}>Info</div>
    
    <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}><DocumentTextIcon className={styles.sideNavButtonIcon}/>Licensing</Link>
    <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}><QuestionMarkCircleIcon className={styles.sideNavButtonIcon}/>About us</Link>
    <Link href={"/contact"} onClick={handleClick} className={`neonBlackButton ${styles.sideNavButton}`}><EnvelopeIcon className={styles.sideNavButtonIcon}/>Contact us</Link>

    <div className={styles.sideNavBar}>Account</div>

    <Link href={"/settings"} className={`neonBlackButton ${styles.sideNavButton}`}><Cog6ToothIcon className={styles.sideNavButtonIcon}/>Settings</Link>
    <Link href={"/"} className={`neonBlackButton ${styles.sideNavButton}`}><ArrowLeftEndOnRectangleIcon className={styles.sideNavButtonIcon}/>Log out</Link>

    </div>
  );
}

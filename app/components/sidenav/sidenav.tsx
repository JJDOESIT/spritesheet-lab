"use client";

import styles from "../sidenav/sidenav.module.css";
import { useRef, useEffect, useState} from "react";
import ProfilePicture from "@/app/components/profilePicture/profilePicture";

export default function SideNav() {
  const containerRef = useRef<HTMLDivElement>(null!);

  const [translateX, setTranslateX] = useState("250px");

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


  return (
    <div
      ref={containerRef}
      style={{ transform: `translateX(${translateX})` }}
      className={`p-4 h-[100%] flex-none w-[250px] bg-black block absolute right-0 ${styles.sideNav}`}
    >
    <ProfilePicture profileImgPath="/jjdoesit.png" username="jjdoesit" className="m-4" />

    <button className="block neonBlackButton ">Your Profile</button>
    </div>
  );
}

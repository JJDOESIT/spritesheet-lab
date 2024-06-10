"use client";

import styles from "../sidenav/sidenav.module.css";
import { useRef, useEffect, useState } from "react";

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
      className={`h-[100%] flex-none w-[250px] bg-black block absolute right-0 ${styles.sideNav}`}
    ></div>
  );
}

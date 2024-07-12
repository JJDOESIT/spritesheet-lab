"use client";

import { redditMono } from "@/app/components/fonts/fonts";
import styles from "@/app/home/home.module.css";
import VerticalCarousel from "../components/verticalCarousel/verticalCarousel";
import { ArrowRightIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import ProfileDataContext from "../functions/profileDataContext";
import { useContext } from "react";

export default function Page() {
  const profileData = useContext(ProfileDataContext);

  
  return (
    <main className={`h-[100%]`}>
      <div
        className={`h-[100%] bg-grey ${styles.homeBG} flex flex-col justify-center`}
      >
        <div className="px-[10vw] animate__animated animate__fadeIn">
          <h1 className={`${redditMono.className} text-3xl md:text-6xl`}>
            An <strong>Open Source</strong> pixel art community
          </h1>
          <div className="text-xl">
            Designed for{" "}
            <VerticalCarousel
              className="inline-block text-xl my-7"
              labels={[
                "artists",
                "designers",
                "gamedevs",
                "students",
                "programmers",
                "hobbyists",
                "animators",
                "educators",
              ]}
              animations={["fadeInDown", "fadeOutDown"]}
            />
          </div>
          <Link
            href={profileData.username ? "/upload" : "/create-account"}
            className={`neonBlackButton inline-block m-6`}
          >
            {profileData.username ?  "Upload Artwork" : "Make account"}
            <ArrowRightIcon className="h-[20px] w-[30px] inline" />
          </Link>
          <Link href={"/gallery"} className={`neonBlackButton inline-block m-6`}>
            Browse gallery
            <ArrowDownIcon className="h-[20px] w-[30px] inline" />
          </Link>
        </div>
      </div>
    </main>
  );
}

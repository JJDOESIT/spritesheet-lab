"use client";

import { redditMono } from "@/app/ui/fonts";
import styles from "@/app/home.module.css";
import VerticalCarousel from "./ui/vertical_carousel";
import { ArrowRightIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Page() {
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
            href={"/create-account"}
            className={`${styles.startButton} inline-block m-6`}
          >
            Start creating
            <ArrowRightIcon className="h-[20px] w-[30px] inline" />
          </Link>
          <Link href={"/"} className={`${styles.startButton} inline-block m-6`}>
            Browse the gallery
            <ArrowDownIcon className="h-[20px] w-[30px] inline" />
          </Link>
        </div>
      </div>
    </main>
  );
}

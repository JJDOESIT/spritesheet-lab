'use client';

import { redditMono } from "@/app/ui/fonts";
import styles from "@/app/home.module.css";


export default function Page() {
  return (
    <main className={`w-screen h-screen overflow-hidden ${styles.homeHeight}`}>
      <div className={`w-[100%] h-[100%] bg-grey ${styles.homeBG} flex flex-col justify-center`}>
        <div className="">
          <h1 className={`${redditMono.className} text-6xl pl-[10vw]`}>An <strong>Open Source</strong> pixel art library</h1>
        </div>
      </div>
    </main>
  );
}
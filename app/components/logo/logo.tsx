import { redditMono } from "@/app/components/fonts/fonts";
import { BeakerIcon } from "@heroicons/react/24/solid";
import styles from "../logo/logo.module.css";
import Link from "next/link";

export default function Logo() {
  return (
    <div className={`flex flex-row items-center text-white`}>
      <Link href={"/"} className="flex items-center">
        <BeakerIcon
          className={`h-[5vw] w-[5vw] animate__animated animate__headShake animate__delay-1s animate__slow ${styles.logoIcon} ${styles.logoSplash}`}
        />
        <p
          className={`${redditMono.className} ${styles.logoText} ${styles.logoSplash} animate__animated animate__fadeInDown`}
        >
          Spritesheet Lab
        </p>
      </Link>
    </div>
  );
}

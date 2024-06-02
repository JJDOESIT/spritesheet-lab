import { redditMono } from "@/app/ui/fonts";
import { BeakerIcon } from '@heroicons/react/24/solid'
import styles from '@/app/ui/logo.module.css'


export default function Logo() {
    return (
        <div className="flex flex-row items-center text-white">
            <BeakerIcon className="h-[5vw] w-[5vw]"/>
            <p className={`${redditMono.className} ${styles.logoText} `}>Spritesheet Lab</p>
        </div>
    )
}
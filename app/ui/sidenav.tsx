'use client';

import styles from "@/app/ui/sidenav.module.css";
import { useRef } from "react";


export default function SideNav() {
    const containerRef = useRef(null);

    return (
    <div ref={containerRef} className={`h-[100%] flex-none w-[250px] bg-black block`}>
        <p>Some words and stuff</p>
    </div>
    )
}
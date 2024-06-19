"use client";

import { useRouter } from "next/navigation";

export default function homePageReroute() {
  const router = useRouter();
  router.push("home/");
}

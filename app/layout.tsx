import "@/app/global.css";
import "animate.css/animate.min.css";
import { redditMono } from "@/app/components/fonts/fonts";
import Navbar from "./components/navbar/navbar";
import SideNav from "./components/sidenav/sidenav";
import styles from "@/app/layout.module.css";
import bgStyles from "@/app/home/home.module.css";
import { tree } from "next/dist/build/templates/app-page";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body className={`${redditMono.className} antialiased`}>
        <Navbar />
        <div
          className={`${styles.heightWithoutTopNav} flex flex-row w-full relative overflow-hidden  ${bgStyles.homeBG}`}
        >
          {children}
          <SideNav />
        </div>
      </body>
    </html>
  );
}

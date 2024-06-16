import "@/app/global.css";
import "animate.css/animate.min.css";
import { redditMono } from "@/app/components/fonts/fonts";
import Navbar from "./components/navbar/navbar";
import SideNav from "./components/sidenav/sidenav";
import styles from "@/app/layout.module.css";
import bgStyles from "@/app/home/home.module.css";
import LoadingIcon from "./components/loadingIcon/loadingIcon";
import { Color } from "three";

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
          <LoadingIcon time={1} tileSize={80} color="RGB(0,255,125)" className="absolute top-1/2 left-1/2"/>
          {children}
          <SideNav />
        </div>
      </body>
    </html>
  );
}

import "@/app/global.css";
import "animate.css/animate.min.css";
import { redditMono } from "@/app/components/fonts/fonts";
import Navbar from "./components/navbar/navbar";
import SideNav from "./components/sidenav/sidenav";
import styles from "@/app/layout.module.css";
import bgStyles from "@/app/home/home.module.css";
import LoadingIcon from "./components/loadingIcon/loadingIcon";


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
          <LoadingIcon color="black" time={1} tileSize={100} className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
          <SideNav />
        </div>
      </body>
    </html>
  );
}

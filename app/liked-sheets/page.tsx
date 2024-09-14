"use client";

import Gallery from "../components/gallery/gallery";
import styles from "../liked-sheets/liked-sheets.module.css";

export default function LikedSheets() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-center w-full mt-[10px]">
        <p className={`text-3xl font-bold ${styles.title}`}>Liked Sheets</p>
      </div>
      <Gallery
        searchInput={null}
        searchRefresh={null}
        searchType={""}
        sortType={"LIKED"}
      ></Gallery>
    </div>
  );
}

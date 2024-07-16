"use client";

import styles from "../gallery/gallery.module.css";
import GallerySideBar from "../components/gallerySideBar/gallerySideBar";
import Gallery from "../components/gallery/gallery";
import { useEffect, useState } from "react";

export default function Page() {
  const [searchType, setSearchType] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_GALLERY_SEARCH!
  );
  function searchTypeCallback(type: string) {
    setSearchType(type);
  }

  useEffect(() => {}, [searchType]);
  return (
    <div className={`${styles.container}`}>
      <GallerySideBar
        searchType={searchType}
        searchTypeCallback={searchTypeCallback}
      ></GallerySideBar>
      <Gallery type={searchType} username={null}></Gallery>
    </div>
  );
}

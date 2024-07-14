"use client";

import styles from "../gallery/gallery.module.css";
import GallerySideBar from "../components/gallerySideBar/gallerySideBar";
import Gallery from "../components/gallery/gallery";

export default function Page() {
  return (
    <div className={`${styles.container}`}>
      <GallerySideBar></GallerySideBar>
      <Gallery
        type={process.env.NEXT_PUBLIC_DEFAULT_GALLERY_SEARCH!}
        username={null}
      ></Gallery>
    </div>
  );
}

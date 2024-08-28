"use client";

import styles from "../gallery/gallery.module.css";
import GallerySideBar from "../components/gallerySideBar/gallerySideBar";
import ProfileDataContext from "../functions/profileDataContext";
import Gallery from "../components/gallery/gallery";
import { useEffect, useState, useContext } from "react";

export default function Page() {
  // Global profile data
  const profileData = useContext(ProfileDataContext);
  // Search input
  const [searchInput, setSearchInput] = useState("");
  // Search refresh
  const [searchRefresh, setSearchRefresh] = useState(false);
  // Sort type
  const [sortType, setSortType] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_GALLERY_SORT!
  );
  // Search type
  const [searchType, setSearchType] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_GALLERY_SEARCH!
  );

  // A function to update the input text from within the gallery sidebar
  function searchInputCallback(input: string) {
    setSearchInput(input);
  }

  // A function to force refresh the search bar from within the gallery sidebar
  function searchRefreshCallback() {
    profileData.refetchProfileCallback();
    setSearchRefresh((prev) => {
      return !prev;
    });
  }

  // A function to update the sort type from within the gallery sidebar
  function sortTypeCallback(type: string) {
    profileData.refetchProfileCallback();
    setSortType(type);
  }

  // A function to update the search type from within the gallery sidebar
  function searchTypeCallback(type: string) {
    profileData.refetchProfileCallback();
    setSearchType(type);
  }

  useEffect(() => {}, [sortType]);
  return (
    <div className={`${styles.container}`}>
      <GallerySideBar
        searchInputCallback={searchInputCallback}
        sortType={sortType}
        sortTypeCallback={sortTypeCallback}
        searchType={searchType}
        searchTypeCallback={searchTypeCallback}
        searchRefreshCallback={searchRefreshCallback}
      ></GallerySideBar>
      <Gallery
        searchInput={searchInput}
        searchRefresh={searchRefresh}
        sortType={sortType}
        searchType={searchType}
      ></Gallery>
    </div>
  );
}

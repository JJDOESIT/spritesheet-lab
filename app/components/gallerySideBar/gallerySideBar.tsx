import styles from "../gallerySideBar/gallerySideBar.module.css";
import { useEffect, useState } from "react";

interface GallerySideBarProps {
  sortType: string;
  sortTypeCallback: Function;
  searchType: string;
  searchTypeCallback: Function;
  searchInputCallback: Function;
  searchRefreshCallback: Function;
}

export default function GallerySideBar(props: GallerySideBarProps) {
  // Sorting
  const [sortType, setSortType] = useState(props.sortType);
  const [sortTypeText, setSortTypeText] = useState(convertSortTypeToText);
  const [sortTypeSelectionVisible, setSortTypeSelectionVisible] =
    useState(false);
  // Searching
  const [searchType, setSearchType] = useState(props.searchType);
  const [searchTypeText, setSearchTypeText] = useState(convertSearchTypeToText);
  const [searchTypeSelectionVisible, setSearchTypeSelectionVisible] =
    useState(false);
  // Sidebar menu toggle
  const [menuToggle, setMenuToggle] = useState(true);

  // Convert a search type into readable text
  function convertSortTypeToText() {
    if (sortType === "BEST") {
      return "Most Liked";
    } else if (sortType === "WORST") {
      return "Least Liked";
    }
  }

  // Convert a search type into readable text
  function convertSearchTypeToText() {
    if (searchType === "USER") {
      return "Username";
    } else if (searchType === "TITLE") {
      return "Title";
    }
  }

  // Whenever the sort type changes, update the visible text accordingly
  useEffect(() => {
    setSortTypeText(convertSortTypeToText);
  }, [sortType]);

  // Whenever the search type changes, update the visible text accordingly
  useEffect(() => {
    setSearchTypeText(convertSearchTypeToText);
  }, [searchType]);

  return (
    <>
      <div
        className={
          menuToggle
            ? `${styles.menuToggle}`
            : `${styles.menuToggle} ${styles.isActive}`
        }
        onClick={() => {
          setMenuToggle((prev) => {
            return !prev;
          });
        }}
      >
        <div className={styles.hamburger}>
          <span></span>
        </div>
      </div>
      <div
        className={
          menuToggle
            ? `${styles.container}`
            : `${styles.container} ${styles.isActive}`
        }
      >
        <div className="w-[90%] flex flex-col items-center">
          <p className="text-white">Search Gallery</p>
          <input
            placeholder="Search"
            type="input"
            onChange={(e) => {
              props.searchInputCallback(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                props.searchRefreshCallback();
              }
            }}
            className={`${styles.searchInput}`}
          ></input>
          <div
            className="relative min-w-full h-fit"
            onClick={() => {
              setSearchTypeSelectionVisible((prev) => {
                return !prev;
              });
              if (sortTypeSelectionVisible) {
                setSortTypeSelectionVisible(false);
              }
            }}
          >
            <div
              className={`w-full bg-white ${styles.searchTypeSelection} neonBlackButton`}
            >
              <p>&#8595; Search By {searchTypeText}</p>
            </div>
            <div
              className="absolute w-full"
              style={
                searchTypeSelectionVisible
                  ? { visibility: "visible", zIndex: 1 }
                  : { visibility: "hidden" }
              }
            >
              <input
                type="button"
                value="Username"
                className={`w-full bg-white ${styles.searchTypeSelection} ${styles.searchTypeChild} neonBlackButton`}
                onClick={() => {
                  setSearchType("USER");
                  props.searchTypeCallback("USER");
                }}
              ></input>
              <input
                type="button"
                value="Title"
                className={`w-full bg-white ${styles.searchTypeSelection} ${styles.searchTypeChild} neonBlackButton`}
                onClick={() => {
                  setSearchType("TITLE");
                  props.searchTypeCallback("TITLE");
                }}
              ></input>
            </div>
          </div>

          <div
            className="relative min-w-full h-fit"
            onClick={() => {
              setSortTypeSelectionVisible((prev) => {
                return !prev;
              });
              if (searchTypeSelectionVisible) {
                setSearchTypeSelectionVisible(false);
              }
            }}
          >
            <div
              className={`w-full bg-white ${styles.sortTypeSelection} neonBlackButton`}
            >
              <p>&#8595; Sort By {sortTypeText}</p>
            </div>
            <div
              className="absolute w-full"
              style={
                sortTypeSelectionVisible
                  ? { visibility: "visible", zIndex: 1 }
                  : { visibility: "hidden" }
              }
            >
              <input
                type="button"
                value="Least Liked"
                className={`w-full bg-white ${styles.sortTypeSelection} ${styles.sortTypeChild} neonBlackButton`}
                onClick={() => {
                  setSortType("WORST");
                  props.sortTypeCallback("WORST");
                }}
              ></input>
              <input
                type="button"
                value="Most Liked"
                className={`w-full bg-white ${styles.sortTypeSelection} ${styles.sortTypeChild} neonBlackButton`}
                onClick={() => {
                  setSortType("BEST");
                  props.sortTypeCallback("BEST");
                }}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import styles from "../gallerySideBar/gallerySideBar.module.css";
import { useEffect, useState } from "react";

interface GallerySideBarProps {
  searchType: string;
  searchTypeCallback: Function;
}

type Visibility = "visible" | "hidden" | "collapse" | "inherit";

export default function GallerySideBar(props: GallerySideBarProps) {
  const [searchType, setSearchType] = useState(props.searchType);
  const [searchTypeText, setSearchTypeText] = useState(convertSearchTypeToText);
  const [menuToggle, setMenuToggle] = useState(true);
  const [searchTypeSelectionVisible, setSearchTypeSelectionVisible] =
    useState<Visibility>("hidden");

  // Convert a search type into readable text
  function convertSearchTypeToText() {
    if (searchType === "BEST") {
      return "Most Liked";
    } else if (searchType === "WORST") {
      return "Least Liked";
    }
  }

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
        <div className="w-[90%]">
          <div
            className="relative min-w-full h-fit"
            onClick={() => {
              setSearchTypeSelectionVisible((prev) => {
                if (prev === "hidden") {
                  return "visible";
                } else {
                  return "hidden";
                }
              });
            }}
          >
            <div className={`w-full bg-white ${styles.searchTypeSelection}`}>
              <p>Sort By {searchTypeText} &#8595;</p>
            </div>
            <div
              className="absolute w-full"
              style={{ visibility: searchTypeSelectionVisible }}
            >
              <input
                type="button"
                value="Least Liked"
                className={`w-full bg-white ${styles.searchTypeSelection}`}
                onClick={() => {
                  setSearchType("WORST");
                  props.searchTypeCallback("WORST");
                }}
              ></input>
              <input
                type="button"
                value="Most Liked"
                className={`w-full bg-white ${styles.searchTypeSelection}`}
                onClick={() => {
                  setSearchType("BEST");
                  props.searchTypeCallback("BEST");
                }}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import GalleryPortrait from "../galleryPortrait/galleryPortrait";
import fetchGalleryPosts from "@/app/functions/fetchGalleryPosts";
import styles from "../gallery/gallery.module.css";
import LoadingIcon from "../loadingIcon/loadingIcon";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface GalleryProps {
  searchInput: string | null;
  searchRefresh: boolean | null;
  sortType: string;
  searchType: string;
}

export default function Gallery(props: GalleryProps) {
  // Searching
  const [searchInput, setSearchInput] = useState(props.searchInput);
  const [searchType, setSearchType] = useState(props.searchType);
  const [searchRefresh, setSearchRefresh] = useState(props.searchRefresh);
  // Sorting
  const [sortType, setSortType] = useState(props.sortType);
  // Page loaded
  const [pageLoaded, setPageLoaded] = useState(false);
  // Url params
  const searchParams = useSearchParams();
  // router
  const router = useRouter();
  // Gallery that holds the posts
  const [gallery, setGallery] = useState([]);
  // Current selected page
  const [currentPage, setCurrentPage] = useState(-1);
  // Pagination
  const [numberedPages, setNumberedPages] = useState([] as Array<number>);
  const [allowPaginationConstruct, setAllowPaginationConstruct] =
    useState(false);
  // Number of posts per page
  const [postsPerPage, setPostsPerPage] = useState(6);
  // The radius for the page selection bar
  const paginationRadius = 2;

  // Fetch the gallery posts
  async function fetchGallery() {
    const data = await fetchGalleryPosts(searchInput, searchType, sortType);
    return data;
  }

  // Whenever the parent's search input text changes, change the internal search text as well
  useEffect(() => {
    if (props.searchInput != searchInput) {
      setSearchInput(props.searchInput);
    }
  }, [props.searchInput]);

  // Whenever the parent forces a search refresh
  useEffect(() => {
    if (props.searchRefresh != searchRefresh) {
      setPageLoaded(false);
      setSearchRefresh(props.searchRefresh);
    }
  }, [props.searchRefresh]);

  // Whenever the parent's search type changes, change the internal search type as well
  useEffect(() => {
    if (props.searchType != searchType) {
      setPageLoaded(false);
      setSearchType(props.searchType);
    }
  }, [props.searchType]);

  // Whenever the parent's sort type changes, change the internal sort type as well
  useEffect(() => {
    if (props.sortType != sortType) {
      setPageLoaded(false);
      setSortType(props.sortType);
    }
  }, [props.sortType]);

  // On page load, set the current page based on the url param
  // Note: If no querey is found, set current page to 0
  useEffect(() => {
    // Set the posts per page based on screen size
    let width = screen.width;
    if (width >= 1893) {
      setPostsPerPage(10);
    } else if (width >= 1573) {
      setPostsPerPage(8);
    } else if (width >= 1253) {
      setPostsPerPage(6);
    } else {
      setPostsPerPage(8);
    }

    const page = parseInt(searchParams.get("page")!);
    if (page != null && page > 0) {
      setCurrentPage(page);
    } else {
      router.replace(
        window.location.origin + window.location.pathname + "?page=0"
      );
      setCurrentPage(0);
    }
  }, []);

  // Fetch the gallery posts
  useEffect(() => {
    if (currentPage != -1) {
      fetchGallery().then((posts) => {
        if (posts) {
          // These two are batches together in the same loop
          // Note: This is done to make sure that we only construct the pagination bar
          // once the gallery has been set, and not on the initial render
          if (currentPage >= Math.ceil(posts.length / postsPerPage)) {
            router.replace(
              window.location.origin + window.location.pathname + "?page=0"
            );
            setCurrentPage(0);
          }
          setAllowPaginationConstruct(true);
          setGallery(posts);
        }
      });
    }
  }, [currentPage, sortType, searchType, searchRefresh]);

  // Everytime the gallery or current page is updated, reset the pagination bar
  // Note: This should only be done once the gallery has been set, which is what
  // the allowPginationConstruct flag is for
  useEffect(() => {
    if (allowPaginationConstruct) {
      const pageLength = Math.ceil(gallery.length / postsPerPage);
      const pages = [];
      pages.push(1);
      if (pageLength === 2) {
        pages.push(2);
      } else {
        for (
          let num = Number(currentPage) - paginationRadius;
          num < Number(currentPage) + paginationRadius + 1;
          num++
        ) {
          if (num > 0 && num < pageLength - 1) {
            pages.push(num + 1);
          }
        }
        if (pageLength > 2) {
          pages.push(pageLength);
        }
      }

      setNumberedPages(pages);
    }
  }, [gallery, currentPage]);

  // Once the pagination bar has been set, allow the page to load
  useEffect(() => {
    if (numberedPages.length > 0) {
      setPageLoaded(true);
    }
  }, [numberedPages]);

  return (
    <>
      {pageLoaded ? (
        <div className="flex flex-col items-center w-full h-full">
          <div className="flex w-full h-[85%] p-[25px]">
            <div
              className={`flex justify-center w-full h-full border-4 border-black rounded-xl ${styles.gridBorder}`}
            >
              {gallery.length > 0 ? (
                <div className={`${styles.gridContainer}`}>
                  {gallery
                    .slice(
                      Number(currentPage) * postsPerPage,
                      Number(currentPage) * postsPerPage + postsPerPage
                    )
                    .map((item: any) => {
                      return (
                        <GalleryPortrait
                          id={item._id}
                          title={item.title}
                          images={item.image}
                          likes={item.likes}
                          username={item.username}
                          profile_image={item.profile_image}
                          speed={item.speed}
                        ></GalleryPortrait>
                      );
                    })}
                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p className="font-bold">No Sheets Found</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex">
            {gallery.length > 0 &&
              numberedPages.map((item, index) => {
                if (index === 0) {
                  return (
                    <p
                      onClick={() => {
                        router.replace(
                          window.location.origin +
                            window.location.pathname +
                            "?page=" +
                            (item - 1).toString()
                        );
                        setCurrentPage(item - 1);
                      }}
                      className={`text-cornFlowerBlue ${styles.pagination}`}
                      style={item - 1 === currentPage ? { color: "black" } : {}}
                    >
                      {numberedPages.length === 1
                        ? item.toString()
                        : item.toString() + "..."}
                    </p>
                  );
                } else if (index === numberedPages.length - 1) {
                  return (
                    <p
                      onClick={() => {
                        router.replace(
                          window.location.origin +
                            window.location.pathname +
                            "?page=" +
                            (item - 1).toString()
                        );
                        setCurrentPage(item - 1);
                      }}
                      className={`text-cornFlowerBlue ${styles.pagination}`}
                      style={item - 1 === currentPage ? { color: "black" } : {}}
                    >
                      {"..." + item.toString()}
                    </p>
                  );
                } else {
                  return (
                    <p
                      onClick={() => {
                        router.replace(
                          window.location.origin +
                            window.location.pathname +
                            "?page=" +
                            (item - 1).toString()
                        );
                        setCurrentPage(item - 1);
                      }}
                      className={`text-cornFlowerBlue ${styles.pagination}`}
                      style={
                        item - 1 === currentPage
                          ? { textDecoration: "underline", color: "black" }
                          : {}
                      }
                    >
                      {item.toString()}
                    </p>
                  );
                }
              })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
        </div>
      )}
    </>
  );
}

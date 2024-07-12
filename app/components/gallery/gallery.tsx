import GalleryPortrait from "../galleryPortrait/galleryPortrait";
import fetchGalleryPosts from "@/app/functions/fetchGalleryPosts";
import styles from "../gallery/gallery.module.css";
import LoadingIcon from "../loadingIcon/loadingIcon";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Gallery() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [gallery, setGallery] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [numberedPages, setNumberedPages] = useState([] as Array<number>);
  const postsPerPage = 10;
  const paginationRadius = 3;

  // Fetch the gallery posts
  async function fetchGallery() {
    const gallery = await fetchGalleryPosts("jjdoesit");
    return gallery;
  }

  // On page load, set the current page based on the url param
  // Note: If no querey is found, set current page to 0
  useEffect(() => {
    const page = parseInt(searchParams.get("page")!);
    if (page) {
      setCurrentPage(page);
    } else {
      setCurrentPage(0);
    }
  }, []);

  // Fetch the gallery posts
  useEffect(() => {
    fetchGallery().then((posts) => {
      setGallery(posts);
    });
  }, []);

  // Set the pagination bar
  useEffect(() => {
    const pageLength = Math.ceil(gallery.length / postsPerPage);
    const pages = [];
    pages.push(1);
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
    setNumberedPages(pages);
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
            <div className="flex justify-center w-full h-full border-4 border-black rounded-xl">
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
                        image={item.image}
                        likes={item.likes}
                      ></GalleryPortrait>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="flex">
            {numberedPages.map((item, index) => {
              if (index === 0) {
                return (
                  <p
                    onClick={() => {
                      router.replace("/gallery?page=" + (item - 1).toString());
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
                      router.replace("/gallery?page=" + (item - 1).toString());
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
                      router.replace("/gallery?page=" + (item - 1).toString());
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

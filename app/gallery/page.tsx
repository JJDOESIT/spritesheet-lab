import styles from "../gallery/gallery.module.css";
import GallerySideBar from "../components/gallerySideBar/gallerySideBar";
import GalleryPortrait from "../components/galleryPortrait/galleryPortrait";

export default function Page() {
  return (
    <div className={`${styles.container}`}>
      <GallerySideBar></GallerySideBar>
      <div className="flex w-[95%] h-[95%] m-[25px] border-4 border-black rounded-xl justify-center">
        <div className={`${styles.gridContainer}`}>
          {Array(10)
            .fill(0)
            .map(() => {
              return <GalleryPortrait title="Test"></GalleryPortrait>;
            })}
        </div>
      </div>
    </div>
  );
}

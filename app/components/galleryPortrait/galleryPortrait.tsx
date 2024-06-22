interface galleryPortraitPropTypes {
  title: string;
}

export default function GalleryPortrait(props: galleryPortraitPropTypes) {
  return (
    <div className="w-full h-full bg-white m-[10px]">
      <div className="w-full h-[80%]"></div>
      <div>
        <p>{props.title}</p>
      </div>
    </div>
  );
}

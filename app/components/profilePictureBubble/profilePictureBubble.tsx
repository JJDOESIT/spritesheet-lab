export default function ProfilePictureBubble({
  className,
  backgroundColor,
  profileImgSrc,
}: {
  className?: string;
  backgroundColor: string;
  profileImgSrc: string;
}) {
  return (
    <div
      className={`flex items-center justify-center w-48 h-48 overflow-hidden ${backgroundColor} rounded-full ${className}`}
    >
      <div
        className="w-[95%] h-[95%] overflow-hidden bg-black rounded-full"
        style={{
          backgroundImage: `url(${profileImgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}

import Image from "next/image";

export default function ProfilePicture({
  profileImgPath,
  username,
  className,
  backgroundColor = "bg-white",
  textColor = "text-white",
}: {
  profileImgPath: string;
  username: string;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
}) {
  return (
    <div className={`${className} flex flex-col items-center`}>
      <div
        className={`flex items-center justify-center w-48 h-48 overflow-hidden ${backgroundColor} rounded-full`}
      >
        <div
          className="w-[95%] h-[95%] overflow-hidden bg-black rounded-full"
          style={{
            backgroundImage: `url(${profileImgPath})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
      <p className={`block text-2xl text-center ${textColor}`}>{username}</p>
    </div>
  );
}

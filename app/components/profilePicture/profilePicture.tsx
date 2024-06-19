import Image from "next/image";
import ProfilePictureBubble from "../profilePictureBubble/profilePictureBubble";

export default function ProfilePicture({
  profileImgSrc: profileImgSrc,
  username,
  className,
  backgroundColor = "bg-white",
  textColor = "text-white",
}: {
  profileImgSrc: string;
  username: string;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
}) {
  return (
    <div className={`${className} flex flex-col items-center`}>
      <ProfilePictureBubble profileImgSrc={profileImgSrc} backgroundColor={backgroundColor} />
      <p className={`block text-2xl text-center ${textColor}`}>{username}</p>
    </div>
  );
}

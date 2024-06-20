import getProfileData from "@/app/functions/getProfileData";
import ProfilePictureBubble from "../profilePictureBubble/profilePictureBubble";
import ProfileDataContext from "@/app/functions/profileDataContext";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import LoadingIcon from "../loadingIcon/loadingIcon";

export function MessageCard({userArray, conversationId} : {userArray: string[], conversationId: string}) {

    console.log(userArray);

    const profileData = useContext(ProfileDataContext);
    const userName = profileData.username;
    const [selected, setSelected] = useState<boolean>(false);

    const [profilePicture, setProfilePicture] = useState<string>("");

    userArray = userArray.filter((user) => user != userName); 

    var userList = ""
    if (userArray.length > 1) {
        for (var i = 0; i < userArray.length; i++) {
            userList += userArray[i];
            if (i < userArray.length - 2) {
                userList += ", ";
            }
            else if (i == userArray.length - 2) {
                if (userArray.length == 2) {
                    userList += " and ";
                }
                else
                {
                    userList += ", and ";
                }
            }
        }
    }
    else if (userArray.length == 1) {
        userList = userArray[0];
    }

    useEffect(() => {
        if (userArray.length > 1) {
            getProfileData(userArray[0]).then((data) => {
                setProfilePicture("group_chat.png");
            });
        } else if (userArray.length == 1) {
            getProfileData(userArray[0]).then((data) => {
                if (data){
                    setProfilePicture(data.profile_image);
                }
            });
        }
    }, [])

    return (
        <Link href={`/messages/${conversationId}`} onClick={() => {setSelected(true)}} passHref legacyBehavior>
            <a>
                <div className={`w-[300px] h-[60px] flex flex-row items-center ${selected ? "bg-green" : "bg-white"} border-black border-[2px] rounded-[13px] m-[8px]`}>
                    {profilePicture == "" ? <LoadingIcon time={1} tileSize={40} color="#000000"></LoadingIcon> :
                    <ProfilePictureBubble className="w-[40px] h-[40px]" backgroundColor="bg-black" profileImgSrc={profilePicture}/>}
                    <p className="ml-[10px] text-sm">{userList}</p>
                </div>
            </a>
        </Link>
    )

}

export function BlankMessageCard() {
    return (
        <div className={`w-[300px] h-[60px] flex flex-col items-center justify-center bg-white border-grey border-[2px] rounded-[13px] m-[10px]`}>
            <LoadingIcon time={1} tileSize={40} color="#A0A0A0"></LoadingIcon>
        </div>
    )
}
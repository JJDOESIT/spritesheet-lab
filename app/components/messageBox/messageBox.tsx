import ProfileDataContext from "@/app/functions/profileDataContext";
import { TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useContext, useState } from "react";


export default function MessageBox({sender, message, sent, usernameNeeded, time, deleteFunction} : {sender: string, message: string, sent: boolean, usernameNeeded: boolean, time: string, deleteFunction: Function}) {

    const profileContext = useContext(ProfileDataContext);

    const [detailsOn, setDetailsOn] = useState(false);
    
    return (
        <div className={`flex flex-col justify-center ${sent ? "items-end" : "items-start"} w-[100%] h-fit`} >
            <div>
                {(usernameNeeded || detailsOn) &&  <Link className="inline text-sm animate__animated animate__fadeIn" href={`/profiles/${sender}`}><strong>{profileContext.username === sender ? "you" : sender}</strong></Link>}
                {detailsOn && <p className="inline text-sm animate__animated animate__fadeIn"> - {time}</p>}
            </div>
            <div className={`bg-black ${sent ? "bg-neonGreen" : "bg-skyBlue"} px-[10px] py-[7px] rounded-lg border-black border-2 w-full max-w-fit overflow-x-auto`} onClick={() => {setDetailsOn((prev: boolean) => {return !prev})}}>
                <p>{message}</p>
            </div>
            <div>
            {detailsOn && profileContext.username === sender && <button className="inline text-sm animate__animated animate__fadeIn" onClick={() => {deleteFunction()}}><div className="flex flex-row items-center justify-center"><TrashIcon className="inline h-[15px] w-[15px] text-black"></TrashIcon><strong>Delete</strong></div></button>}
            </div>
        </div>
    )
}
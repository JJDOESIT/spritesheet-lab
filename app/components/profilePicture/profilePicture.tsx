
import Image from "next/image"

export default function ProfilePicture({profileImgPath, username, className} : {profileImgPath: string, username: string, className?: string}){
    return (
        <div className={`${className} flex flex-col items-center` }>
            <div className="flex items-center justify-center w-48 h-48 overflow-hidden bg-white rounded-full">
                <div 
                    className="w-[95%] h-[95%] overflow-hidden bg-black rounded-full"
                    style={{ backgroundImage: `url(${profileImgPath})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
              
                </div>
            </div>
            <p className="block text-2xl text-center text-white">{username}</p>
        </div>
    )
}
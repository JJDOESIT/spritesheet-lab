"use client";
import MessageBox from "@/app/components/messageBox/messageBox";
import getMessages from "@/app/functions/getMessages";
import { get } from "http";
import { ObjectId } from "mongodb";
import { useContext, useEffect, useRef, useState } from "react";
import ProfileDataContext from "@/app/functions/profileDataContext";
import sendMessage from "@/app/functions/sendMessage";
import LoadingIcon from "@/app/components/loadingIcon/loadingIcon";

interface PageProps {
    params: {
      messageId: string;
    };
  }
  
export default function Page({ params }: PageProps) {
    const [messagesArray, setMessagesArray] = useState([]);

    const inputRef = useRef<HTMLInputElement>(null);

    const profileContext = useContext(ProfileDataContext);

    function getMessagesArray() {
        getMessages(params.messageId).then((data) => {
            setMessagesArray(data);
        });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getMessagesArray();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    async function onSubmit() {
        const inputText = inputRef.current!.value as string | null;
        inputRef.current!.value = "";
        if (!inputText) {
            return;
        }
        console.log(inputText);
        await sendMessage(params.messageId, inputText);
        getMessagesArray();
    }
    
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                onSubmit();
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    
    return (
        <div className="flex-col items-center justify-center w-full h-full ">
            <div className={`flex flex-col-reverse items-center ${messagesArray.length === 0 ? "justify-center" : "justify-start"} w-full h-[92%] p-[20px] overflow-y-auto`}>
                {messagesArray.length === 0 ? <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon> : 
                messagesArray.map((message : any) => {
                    return <MessageBox sender={message.user} message={message.message} sent={message.user == profileContext.username} />
                })}
            </div>
            <div className="flex items-center justify-center w-full h-[8%] px-[10px]">
                <input ref={inputRef} type="text" className="w-[80%] h-[80%] rounded-lg border-black border-2 p-[10px]" />
                <button className="w-[20%] h-[80%] neonBlackButton" onClick={() => {onSubmit()}} >Send</button>
            </div>
        </div>
    )

}
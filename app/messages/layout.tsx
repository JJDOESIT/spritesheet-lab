"use client";

import { useEffect, useState } from "react"
import getConversations from "../functions/getConversations"
import {MessageCard} from "../components/messageCard/messageCard";
import LoadingIcon from "../components/loadingIcon/loadingIcon";

export default function Layout({children}: {children: React.ReactNode}) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        getConversations().then((data) => {
            if (data) {
                setConversations(data);
            }
        });
    }, [])

    function getConversationCards()
    {
        return conversations.map((conversation: any, index: any) => (
            <MessageCard key={index} userArray={conversation.users} conversationId={conversation._id}/>
        ))
    }


    return (
        <main className="flex flex-col md:flex-row p-[30px] w-full">
            <div className="flex flex-col items-center h-fit md:h-full border-black border-[2px] rounded-[13px] bg-white w-[430px] overflow-x-visible overflow-y-scroll hideScrollbar">
                {conversations.length == 0 ? 
                <div className="flex flex-col items-center justify-center h-full w-[300px] m-[10px]">
                    <LoadingIcon time={1} tileSize={90} color="#A0A0A0"></LoadingIcon>
                </div> 
                : getConversationCards()}
            </div>
            <div className="md:h-full md:w-full border-black border-[2px] rounded-[13px] bg-white">
                {children}
            </div>
        </main>
    )

}
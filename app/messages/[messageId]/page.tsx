"use client";
import getMessages from "@/app/functions/getMessages";
import { get } from "http";
import { ObjectId } from "mongodb";

interface PageProps {
    params: {
      messageId: string;
    };
  }
  
export default function Page({ params }: PageProps) {


    async function getMessageP() {
        console.log("MessageP: " + params.messageId);
        return getMessages(params.messageId).then((data) => {
            console.log(JSON.stringify(data));
        });
    }

    getMessageP();

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <p>Select a conversation to view its messages.</p>
        </div>
    )

}
"use client";
import { useEffect } from "react"
import getConversations from "../functions/getConversations"


export default function Page() {


    useEffect(() => {
        getConversations().then((data) => {
            console.log("Messages: " + data);
        });
    }, [])


    return (
        <div>
            <h1>Messages</h1>
        </div>
    )

}
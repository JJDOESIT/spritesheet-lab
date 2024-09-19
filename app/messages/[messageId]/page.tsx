"use client";

import MessageBox from "@/app/components/messageBox/messageBox";
import getMessages from "@/app/functions/getMessages";
import { useContext, useEffect, useRef, useState } from "react";
import ProfileDataContext from "@/app/functions/profileDataContext";
import sendMessage from "@/app/functions/sendMessage";
import LoadingIcon from "@/app/components/loadingIcon/loadingIcon";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { IDstringTodate, timeDifference } from "@/app/functions/timeFunctions";
import deleteMessage from "@/app/functions/deleteMessage";

interface PageProps {
  params: {
    messageId: string;
  };
}

export default function Page({ params }: PageProps) {
  const [messagesArray, setMessagesArray] = useState<any[] | null>(null);
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  const profileContext = useContext(ProfileDataContext);

  function getMessagesArray() {
    getMessages(params.messageId).then((data) => {
      setMessagesArray((prev: any[] | null) => {
        if (prev == null) {
          return data;
        } else if (data.length > prev.length) {
          return data;
        }
        return prev;
      });
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
    if (!inputText || inputText == "") {
      return;
    }
    setMessagesArray((prev) => {
      if (prev == null) {
        return [{ user: profileContext.username, message: inputText } as any];
      }
      return [{ user: profileContext.username, message: inputText }, ...prev];
    });

    inputRef.current!.value = "";
    if (!inputText) {
      return;
    }
    sendMessage(params.messageId, inputText);
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
    <div className="h-full w-full border-black border-[2px] rounded-[13px] bg-white flex-col items-center justify-center">
      {isMd ? (
        <></>
      ) : (
        <div className="flex flex-row items-center justify-center">
          <Link
            href={"/messages"}
            className="block w-full border-b-2 border-black h-[6%]"
          >
            <ArrowLeftIcon
              height={"20px"}
              width={"20px"}
              className="inline"
            ></ArrowLeftIcon>
            <p className="inline">Back</p>
          </Link>
        </div>
      )}
      <div
        className={`flex flex-col-reverse items-center ${
          messagesArray === null ? "justify-center" : "justify-start"
        } w-full md:h-[92%] h-[88%] p-[20px] overflow-y-auto`}
      >
        {messagesArray === null ? (
          <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
        ) : (
          messagesArray
            .filter((message: any) => {
              return message != null;
            })
            .map((message: any, index: number) => {
              const previousMessage = messagesArray[index + 1];
              const usernameNeeded = !(
                previousMessage && previousMessage.user === message.user
              );
              var time = "just now";
              if (message._id) {
                time = timeDifference(IDstringTodate(message._id));
              }
              return (
                <MessageBox
                  sender={message.user}
                  message={message.message}
                  sent={message.user == profileContext.username}
                  usernameNeeded={usernameNeeded}
                  time={time}
                  deleteFunction={() => {
                    deleteMessage(params.messageId, message._id);
                    getMessages(params.messageId).then((data) => {
                      setMessagesArray(data);
                    });
                  }}
                />
              );
            })
        )}
      </div>
      <div className="flex items-center justify-center w-full h-[8%] px-[10px] border-t-2 border-black">
        <input
          ref={inputRef}
          type="text"
          className="w-[80%] h-[80%] rounded-lg border-black border-2 p-[10px]"
        />
        <button
          className="w-[20%] h-[80%] neonBlackButton"
          onClick={() => {
            onSubmit();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

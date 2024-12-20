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

interface ConversationBoxProps {
  messageID: string;
  users: Array<String>;
}

export default function ConversationBox(props: ConversationBoxProps) {
  const [messagesArray, setMessagesArray] = useState<any[] | null>(null);
  const [prevUser, setPrevUser] = useState(null);
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);

  // Use a ref to hold the latest state values
  const messagesRef = useRef(messagesArray);
  const prevUserRef = useRef(prevUser);

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

  // Update the refs whenever state changes
  useEffect(() => {
    messagesRef.current = messagesArray;
  }, [messagesArray]);

  useEffect(() => {
    prevUserRef.current = prevUser;
  }, [prevUser]);

  function getMessagesArray() {
    getMessages(props.messageID).then((data) => {
      setMessagesArray((prev) => {
        console.log(prevUser, props.users);
        if (prev === null) {
          return data;
        } else {
          if (!prevUserRef.current) {
            return data;
          }
          if (props.users !== prevUserRef.current) {
            return data;
          } else {
            console.log(Object.keys(messagesRef.current).length, data.length);
            if (
              messagesRef.current &&
              Object.keys(messagesRef.current).length > data.length
            ) {
              console.log("return messages");
              return messagesRef.current;
            } else {
              return data;
            }
          }
        }
      });
      setPrevUser(props.users);
    });
  }

  useEffect(() => {
    console.log(props.messageID);
    const interval = setInterval(() => {
      getMessagesArray();
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, [props.messageID]);

  async function onSubmit() {
    const inputText = inputRef.current!.value as string | null;
    if (!inputText || inputText == "") {
      return;
    }
    setMessagesArray((prev) => {
      if (prev == null) {
        // If prev is null, initialize it as an array with the new message object.
        return [{ user: profileContext.username, message: inputText }];
      }

      // Return a new array with the previous messages and the new message appended.
      return [{ user: profileContext.username, message: inputText }, ...prev];
    });

    inputRef.current!.value = "";
    if (!inputText) {
      return;
    }
    sendMessage(props.messageID, inputText);
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
                    deleteMessage(props.messageID, message._id);
                    getMessages(props.messageID).then((data) => {
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

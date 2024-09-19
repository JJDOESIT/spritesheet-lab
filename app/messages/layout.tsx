"use client";

import React, { useEffect, useState } from "react";
import getConversations from "../functions/getConversations";
import { MessageCard } from "../components/messageCard/messageCard";
import LoadingIcon from "../components/loadingIcon/loadingIcon";
import { usePathname } from "next/navigation";
import userExists from "../functions/userExists";
import Alert from "../components/alert/alert";
import createAlert from "../functions/createAlert";
import createConversation from "../functions/createConversation";
import path from "path";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState([]);
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);
  const pathName = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const messageAreaRef = React.useRef<HTMLDivElement>(null);

  const [newUsers, setNewUsers] = useState<string[]>([]);

  const [userMissingAlert, setUserMissingAlert] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });

  useEffect(() => {
    setIsLoadingMessages(false);
  }, [children]);


  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.addEventListener("click", () => {
        setLoadingMessages(true);
      });
    }
  })

  // this is a hacky solution to play a loading animation before the messages load
  useEffect(() => {
    const handlePathChange = () => {
      setLoadingMessages(false);
    };

    handlePathChange(); 

    return () => {};
  }, [pathName]);

  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setConversationCards();
  }, []);

  async function setConversationCards() {
    getConversations().then((data) => {
      if (data) {
        setConversations(data);
      }
    });
  }

  function userAlertCallback(status: boolean) {
    if (!status) {
      setUserMissingAlert(
        createAlert({
          type: "error",
          message: "User doesn't exist ...",
          hidden: false,
          maxWidth: 400,
        })
      );
    }
  }

  function getConversationCards() {
    return conversations.map((conversation: any, index: any) => (
      <div
        onClick={() => {
          setSelectedIndex(index);
          //setIsLoadingMessages(true);
        }}
      >
        <MessageCard
          key={index}
          userArray={conversation.users}
          conversationId={conversation._id}
          selected={index === selectedIndex}
        />
      </div>
    ));
  }

  function removeUser(index: number) {
    const updatedUsers = [...newUsers];
    updatedUsers.splice(index, 1);
    setNewUsers(updatedUsers);
  }

  async function addUser() {
    const input = document.getElementById("username-input") as HTMLInputElement;
    const username = input.value.toLowerCase();
    if (username && !newUsers.includes(username)) {
      var result = await userExists(username);
      userAlertCallback(result);
      if (result) {
        setNewUsers((prev: string[]) => {
          return [...prev, username];
        });
        input.value = "";
      }
    }
  }

  async function createConvo() {
    await createConversation(newUsers);
    setNewUsers([]);
    await setConversationCards();
  }

  return (
    <main className="flex flex-col md:flex-row p-[30px] w-full justify-center items-center animate__animated animate__fadeIn">
      {pathName.endsWith("messages") || isMd ? (
        <div className="flex flex-col items-center flex-shrink-0 h-full border-black border-[2px] rounded-[13px] bg-white w-[330px] overflow-x-visible overflow-y-scroll hideScrollbar">
          <div className="w-full h-fit border-black border-b-[2px]">
            <div className="p-2">
              <input
                id="username-input"
                placeholder="Username"
                type="text"
                className="p-1 border-2 rounded-3xl border-slate-300 w-[90%]"
                onChange={() => {
                  setUserMissingAlert((prev) => {
                    return { ...prev, hidden: true };
                  });
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    addUser();
                  }
                }}
              ></input>
              <button className="neonBlackButton w-[10%]" onClick={addUser}>
                +
              </button>
            </div>
            <Alert
              hidden={userMissingAlert["hidden"]}
              message={userMissingAlert["message"]}
              borderColor={userMissingAlert["borderColor"]}
              backgroundColor={userMissingAlert["backgroundColor"]}
              fontColor={userMissingAlert["fontColor"]}
              maxWidth={userMissingAlert["maxWidth"]}
              toggleHidden={() =>
                setUserMissingAlert((prev) => {
                  return { ...prev, hidden: true };
                })
              }
            ></Alert>
            {newUsers.length === 0 ? (
              <p className="p-2 text-s">
                Use the box above to add users to a new conversation.
              </p>
            ) : (
              <>
                <div className="p-2">
                  {newUsers.map((user, index) => (
                    <button
                      className="m-1 redBlackButton"
                      onClick={() => removeUser(index)}
                    >
                      {user}
                    </button>
                  ))}
                </div>
                <div className="p-2">
                  <button
                    className="w-full neonBlackButton"
                    onClick={() => {
                      createConvo();
                    }}
                  >
                    Create
                  </button>
                </div>
              </>
            )}
          </div>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[90%] w-[300px] m-[10px]">
              <LoadingIcon time={1} tileSize={90} color="#000000"></LoadingIcon>
            </div>
          ) : (
            <div ref={messageAreaRef}>
              {getConversationCards()}
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
      {loadingMessages ? (
        <div className="h-full md:w-full border-black border-[2px] rounded-[13px] bg-white">
          <div className="flex flex-col items-center justify-center w-full h-full p-[10px]">
            <div className="flex flex-col items-center justify-center h-[90%] w-[300px] m-[10px]">
              <LoadingIcon time={1} tileSize={90} color="#000000"></LoadingIcon>
            </div>
          </div>
        </div>
      ) : (
        isLoadingMessages ? (
        <>
          <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
        </>
        
      ) : (children)
      )}
    </main>
  );
}

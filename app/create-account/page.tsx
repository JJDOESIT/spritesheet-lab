"use client";

import styles from "./create-account.module.css";
import bgStyles from "../home.module.css";
import Alert from "../components/alert/alert";
import { useState } from "react";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertData, setAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
  });

  async function handleSubmit(info: { [key: string]: string }) {
    try {
      const response = await fetch("/api/create-account", {
        method: "POST",
        body: JSON.stringify(info),
      });
      const data = await response.json();
      if (data.status === 410) {
        setAlertData({
          hidden: false,
          message: "Username: Must Be 8 Characters",
          borderColor: "1px solid #f5c6cb",
          backgroundColor: "#f8d7da",
          fontColor: "#721c24",
        });
      } else if (data.status === 420) {
        setAlertData({
          hidden: false,
          message: "Password: 8",
          borderColor: "1px solid #f5c6cb",
          backgroundColor: "#f8d7da",
          fontColor: "#721c24",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertData({
        hidden: false,
        message: "Internal Server Error ...",
        borderColor: "1px solid #f5c6cb",
        backgroundColor: "#f8d7da",
        fontColor: "#721c24",
      });
    }
  }

  return (
    <>
      <div
        className={`flex w-full justify-center items-center ${styles.container} ${bgStyles.homeBG}`}
      >
        <form
          className={`flex flex-col w-fit h-fit border-4 p-10 rounded-xl border-black bg-white ${styles.form}`}
        >
          <div className="flex justify-center">
            <p className="text-2xl font-semibold">Create Account</p>
          </div>
          <input
            id="username"
            placeholder="Username"
            type="text"
            className="p-1 mt-5 border-2 rounded-3xl border-slate-300"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="p-1 mt-2 border-2 rounded-3xl border-slate-300 mb-[15px]"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <Alert
            hidden={alertData["hidden"]}
            message={alertData["message"]}
            borderColor={alertData["borderColor"]}
            backgroundColor={alertData["backgroundColor"]}
            fontColor={alertData["fontColor"]}
            toggleHidden={() =>
              setAlertData((prev) => {
                return { ...prev, hidden: true };
              })
            }
          ></Alert>
          <input
            type="button"
            value="Submit"
            className={`border-2 mt-5 border-slate-300 ${styles.submit}`}
            onClick={() =>
              handleSubmit({ username: username, password: password })
            }
          ></input>
        </form>
      </div>
    </>
  );
}

"use client";

import styles from "../login/login.module.css";
import Alert from "../components/alert/alert";
import createAlert from "../functions/createAlert";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertData, setAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });

  async function handleSubmit(info: { [key: string]: string }) {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(info),
      });
      const data = await response.json();
      if (data.status === 200) {
        await router.refresh();
        await router.push("/settings");
        location.replace("/settings");
      }
    } catch (error) {
      console.log(error);
      setAlertData(
        createAlert({
          type: "error",
          message: "Internal Server Error",
          hidden: false,
          maxWidth: 225,
        })
      );
    }
  }

  return (
    <>
      <div
        className={`flex w-full justify-center items-center h-full animate__animated animate__fadeIn`}
      >
        <form
          className={`flex flex-col w-fit h-fit border-4 p-10 rounded-xl border-black bg-white ${styles.form}`}
        >
          <div className="flex justify-center">
            <p className="text-2xl font-semibold">Login</p>
          </div>
          <input
            id="username"
            placeholder="Username"
            type="text"
            className="p-1 mt-5 border-2 rounded-3xl border-slate-300"
            maxLength={15}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="p-1 mt-2 border-2 rounded-3xl border-slate-300 mb-[15px]"
            maxLength={128}
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
            maxWidth={alertData["maxWidth"]}
            toggleHidden={() =>
              setAlertData((prev) => {
                return { ...prev, hidden: true };
              })
            }
          ></Alert>
          <input
            type="button"
            value="Login"
            className={`border-2 mt-5 border-slate-300 neonBlackButton`}
            onClick={() =>
              handleSubmit({ username: username, password: password })
            }
          ></input>
          <a href="/create-account" className="w-fit">
            <p className="mt-2 underline text-skyBlue underline-offset-2">
              Register Instead
            </p>
          </a>
        </form>
      </div>
    </>
  );
}

"use client";

import styles from "./create-account.module.css";
import Alert from "../components/alert/alert";
import createAlert from "../functions/createAlert";
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
    maxWidth: 0,
  });

  async function handleSubmit(info: { [key: string]: string }) {
    try {
      const response = await fetch("/api/create-account", {
        method: "POST",
        body: JSON.stringify(info),
      });
      const data = await response.json();
      if (data.status === 400) {
        setAlertData(
          createAlert({
            type: "error",
            message: "Username taken",
            hidden: false,
            maxWidth: 225,
          })
        );
      } else if (data.status === 410) {
        setAlertData(
          createAlert({
            type: "error",
            message: "Username must be 8 characters",
            hidden: false,
            maxWidth: 225,
          })
        );
      } else if (data.status === 420) {
        setAlertData(
          createAlert({
            type: "error",
            message: "Password must be 8 characters",
            hidden: false,
            maxWidth: 225,
          })
        );
      } else if (data.status == 430) {
        setAlertData(
          createAlert({
            type: "error",
            message:
              "Username must only contain letters, numbers, periods, or commas",
            hidden: false,
            maxWidth: 225,
          })
        );
      } else if (data.status == 440) {
        setAlertData(
          createAlert({
            type: "error",
            message:
              "Password must only contain letters, numbers, or special characters",
            hidden: false,
            maxWidth: 225,
          })
        );
      } else if (data.status == 450) {
        setAlertData(
          createAlert({
            type: "error",
            message: "Username must contain at least one letter",
            hidden: false,
            maxWidth: 225,
          })
        );
      } else if (data.status == 460) {
        setAlertData(
          createAlert({
            type: "error",
            message: "Password must contain at least one letter and one number",
            hidden: false,
            maxWidth: 225,
          })
        );
      } else if (data.status === 500) {
        setAlertData(
          createAlert({
            type: "error",
            message: "Internal Server Error",
            hidden: false,
            maxWidth: 225,
          })
        );
      } else if (data.status === 200) {
        setAlertData(
          createAlert({
            type: "success",
            message: "Account created",
            hidden: false,
            maxWidth: 225,
          })
        );
      }
    } catch (error) {
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
        className={`flex w-full justify-center items-center h-full animate__animated animate__fadeIn ${styles.container}`}
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

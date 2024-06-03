"use client";

import styles from "./create-account.module.css";
import bgStyles from "../home.module.css";
import { useState } from "react";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(info: { [key: string]: string }) {
    try {
      const response = await fetch("/api/create-account", {
        method: "POST",
        body: JSON.stringify(info),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
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
            className="border-2 rounded-3xl p-1 mt-5 border-slate-300"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="border-2 rounded-3xl p-1 mt-2 border-slate-300"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
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

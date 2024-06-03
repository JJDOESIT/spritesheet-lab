"use client";

import styles from "./create-account.module.css";
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <div
        className={`flex w-full justify-center items-center ${styles.container}`}
      >
        <form className="flex flex-col w-fit h-fit border-2 p-5 rounded-md">
          <div className="flex justify-center">
            <p>Create Account</p>
          </div>
          <input
            id="username"
            placeholder="Username"
            type="text"
            className="border-2 rounded-3xl p-1 mt-2"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="border-2 rounded-3xl p-1 mt-2"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
          <input
            type="button"
            value="Submit"
            className="border-2 mt-2"
            onClick={() =>
              handleSubmit({ username: username, password: password })
            }
          ></input>
        </form>
      </div>
    </>
  );
}

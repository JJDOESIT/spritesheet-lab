"use client";
import LoadingIcon from "../components/loadingIcon/loadingIcon";
import Alert from "../components/alert/alert";
import createAlert from "../functions/createAlert";
import sendEmailAuth from "../functions/sendEmailAuth";
import { sendVerificationEmail } from "../functions/sendVerificationEmail";
import { useState, useRef, useEffect } from "react";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  // Front end text-input validation
  const [usernameValidation, setUsernameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");

  const [alertData, setAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });

  useEffect(() => {
    const usernameLengthRequirement = 2;
    const passwordLengthRequirement = 8;
    const usernameRegex = /^[a-zA-Z0-9._]*$/;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]*$/;

    if (username) {
      // Username too short
      if (username.length < usernameLengthRequirement) {
        setUsernameValidation(
          `\u2022Username must be ${usernameLengthRequirement} characters long`
        );
      }
      // Username must only contain numbers, letters, . or _
      else if (!usernameRegex.test(username)) {
        setUsernameValidation(
          "\u2022Username must only contain numbers, letters, . or _"
        );
      }
      // Username must contain at least one letter
      else if (!/^(?=.*[a-zA-Z]).*$/.test(username)) {
        setUsernameValidation(
          "\u2022Username must contain at least one letter"
        );
      }
      // Else looks good
      else {
        setUsernameValidation("");
      }
    }
    if (password) {
      // Password too short
      if (password.length < passwordLengthRequirement) {
        setPasswordValidation(
          `\u2022Password must be ${passwordLengthRequirement} characters long`
        );
      }

      // Password must only contain numbers, letters, and special characters
      else if (!passwordRegex.test(password)) {
        setPasswordValidation(
          "\u2022Password must only contain numbers, letters, and special characters"
        );
      }

      // Password must contain at least one number and one letter
      else if (
        !/^(?=.*\d).+$/.test(password) ||
        !/^(?=.*[a-zA-Z]).*$/.test(password)
      ) {
        setPasswordValidation(
          "\u2022Password must contain at least one number and one letter"
        );
      }
      // Else looks good
      else {
        setPasswordValidation("");
      }
    }
    if (email) {
      // Email doesn't contain an @ symbol
      if (!email.includes("@")) {
        setEmailValidation("\u2022Email must contain an @");
      }
      // Else looks good
      else {
        setEmailValidation("");
      }
    }
  }, [username, email, password]);

  async function handleSubmit(info: { [key: string]: string }) {
    try {
      setLoadingPage(true);
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
      } else if (data.status == 470) {
        setAlertData(
          createAlert({
            type: "error",
            message: "Email missing an @",
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
      }
      // If the account creation process succeeded
      else if (data.status === 200) {
        setAlertData(
          createAlert({
            type: "success",
            message: "Account created",
            hidden: false,
            maxWidth: 225,
          })
        );
        const data = await sendEmailAuth(username);
        console.log(data);
        if (data) {
          sendVerificationEmail(data.email, data.username, data.token, null);
        }
      }
      setPasswordValidation("");
      setUsernameValidation("");
      setLoadingPage(false);
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
      setPasswordValidation("");
      setUsernameValidation("");
      setLoadingPage(false);
    }
  }

  return (
    <>
      {!loadingPage ? (
        <div
          className={`flex w-full justify-center items-center h-full animate__animated animate__fadeIn`}
        >
          <form className={`roundedForm`}>
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
              id="email"
              placeholder="Email"
              type="email"
              className="p-1 mt-1 border-2 rounded-3xl border-slate-300"
              maxLength={100}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="p-1 mt-1 border-2 rounded-3xl border-slate-300 mb-[15px]"
              maxLength={128}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
            <div>
              <p className="text-[12px] text-red-600 max-w-[210px]">
                {usernameValidation}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-red-600 max-w-[210px]">
                {emailValidation}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-red-600 max-w-[210px]">
                {passwordValidation}
              </p>
            </div>
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
              className={`border-2 mt-5 border-slate-300 neonBlackButton`}
              onClick={() =>
                handleSubmit({
                  username: username,
                  email: email,
                  password: password,
                })
              }
            ></input>
            <a href="/login" className="w-fit">
              <p className="mt-2 underline text-skyBlue underline-offset-2">
                Login Instead
              </p>
            </a>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
        </div>
      )}
    </>
  );
}

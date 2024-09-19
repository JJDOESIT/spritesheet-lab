"use client";

import verifyEmailAuth from "../functions/verifyEmailAuth";
import sendEmailAuth from "../functions/sendEmailAuth";
import ProfileDataContext from "../functions/profileDataContext";
import styles from "../verify-email/verify-email.module.css";
import Alert from "../components/alert/alert";
import createAlert from "../functions/createAlert";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { sendVerificationEmail } from "../functions/sendVerificationEmail";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function VerifyEmail() {
  // Profile data
  const profileData = useContext(ProfileDataContext);
  // Url params
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  // Alert data
  const [alertData, setAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });
  const [verified, setVerified] = useState<Boolean | null>(null);

  function emailCallback(success: boolean) {
    if (success) {
      setAlertData(
        createAlert({
          type: "success",
          message: "Email Verification Sent",
          hidden: false,
          maxWidth: 350,
        })
      );
    } else {
      setAlertData(
        createAlert({
          type: "error",
          message: "Please try again",
          hidden: false,
          maxWidth: 350,
        })
      );
    }
  }

  // On page load, set the token from the url param
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
    }
  }, []);

  // Verify an email based on the url token
  async function verify(token: string) {
    const status = await verifyEmailAuth(token);
    if (status === 200) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }

  // When the url token changes, try to verify the email
  useEffect(() => {
    if (token) {
      verify(token);
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {!token ? (
        <div
          className={`${styles.verifyEmail} flex flex-col items-center jusify-center`}
        >
          <p className="text-5xl">
            Hello <span className="font-bold">{profileData.username}</span>
          </p>
          <p className="text-lg pb-[20px]">Please verify your email.</p>
          <input
            className={`neonBlackButton mb-[20px] ${styles.sendEmailButton}`}
            onClick={async () => {
              const data = await sendEmailAuth(null);
              if (data) {
                sendVerificationEmail(
                  data.email,
                  data.username,
                  data.token,
                  emailCallback
                );
              } else {
                setAlertData(
                  createAlert({
                    type: "error",
                    message: "Server Error - Please Refresh",
                    hidden: false,
                    maxWidth: 350,
                  })
                );
              }
            }}
            type="button"
            value="Verify Email"
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
        </div>
      ) : (
        <>
          {verified === null && <p>Please wait while we verify ...</p>}
          {verified && (
            <div>
              <CheckCircleIcon></CheckCircleIcon>
              <p className="text-xl text-center">
                Thank you for verifying your email!
              </p>
            </div>
          )}
          {!verified && verified != null && (
            <div
              className={`${styles.verifyFailed} flex flex-col items-center justify-center`}
            >
              <img
                className={`w-[200px] h-[200px] mb-[50px] ${styles.emailIcon}`}
                src="/email-icon.png"
              ></img>
              <p className="text-3xl font-xl mb-[20px]">Link Expired</p>
              <input
                className={`neonBlackButton mb-[20px] ${styles.sendEmailButton}`}
                onClick={async () => {
                  const data = await sendEmailAuth(null);
                  if (data) {
                    sendVerificationEmail(
                      data.email,
                      data.username,
                      data.token,
                      emailCallback
                    );
                  }
                }}
                type="button"
                value="Request New Email"
              ></input>
            </div>
          )}
        </>
      )}
    </div>
  );
}

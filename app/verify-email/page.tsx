"use client";

import verifyEmailAuth from "../functions/verifyEmailAuth";
import sendEmailAuth from "../functions/sendEmailAuth";
import ProfileDataContext from "../functions/profileDataContext";
import emailjs from "@emailjs/browser";
import styles from "../verify-email/verify-email.module.css";
import Alert from "../components/alert/alert";
import createAlert from "../functions/createAlert";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
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

  // Function to send email
  const sendEmail = (email: string, username: string, token: string) => {
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_AUTH_SERVICE_KEY!, // Service ID
        process.env.NEXT_PUBLIC_EMAIL_AUTH_TEMPLATE_KEY!, // Template ID
        {
          email: email,
          username: username,
          token:
            process.env.NEXT_PUBLIC_BASE_URL! + "verify-email?token=" + token, // Template parameters
        },
        process.env.NEXT_PUBLIC_EMAIL_AUTH_PUBLIC_KEY! // Public key
      )
      .then(
        () => {
          setAlertData(
            createAlert({
              type: "success",
              message: "Email Verification Sent",
              hidden: false,
              maxWidth: 350,
            })
          );
        },
        (error) => {
          setAlertData(
            createAlert({
              type: "error",
              message: "Please try again",
              hidden: false,
              maxWidth: 350,
            })
          );
        }
      );
  };

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
              const data = await sendEmailAuth();
              if (data) {
                sendEmail(data.email, data.username, data.token);
              } else {
                setAlertData(
                  createAlert({
                    type: "error",
                    message: "Please log in",
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
                  const data = await sendEmailAuth();
                  if (data) {
                    sendEmail(data.email, data.username, data.token);
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

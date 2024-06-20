"use client";

import { useState, useEffect, useContext } from "react";
import ProfileDataContext from "../functions/profileDataContext";
import styles from "../settings/settings.module.css";
import createAlert from "../functions/createAlert";
import ProfilePicture from "../components/profilePicture/profilePicture";
import UploadImage from "../components/uploadImage/uploadImage";
import LoadingIcon from "../components/loadingIcon/loadingIcon";
import Alert from "../components/alert/alert";
import updateDBField from "../functions/updateDBField";

export default function Settings() {
  const profileData = useContext(ProfileDataContext);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [imageAlertData, setImageAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });
  const [nameAlertData, setNameAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });

  // Image alert callback
  function imageAlertCallback(status: number) {
    if (status == 200) {
      setImageAlertData(
        createAlert({
          type: "success",
          message: "Image Uploaded. Please refresh.",
          hidden: false,
          maxWidth: 400,
        })
      );
    } else {
      setImageAlertData(
        createAlert({
          type: "error",
          message: "Error Uploading Image ...",
          hidden: false,
          maxWidth: 400,
        })
      );
    }
  }

  async function handleEditName() {
    const name = document.getElementById("name") as HTMLInputElement;
    if (name && name.value) {
      if (name.value.length > 0 && name.value.length <= 50) {
        const status = await updateDBField("profiles", "name", name.value);
        if (status == 200) {
          setNameAlertData(
            createAlert({
              type: "success",
              message: "Name updated. Please refresh.",
              hidden: false,
              maxWidth: 400,
            })
          );
        } else {
          setNameAlertData(
            createAlert({
              type: "error",
              message: "Error Updating Name ...",
              hidden: false,
              maxWidth: 400,
            })
          );
        }
      } else {
        setNameAlertData(
          createAlert({
            type: "error",
            message: "Error: Name must be between 1 and 50 characters ...",
            hidden: false,
            maxWidth: 300,
          })
        );
      }
    }
  }

  // On render, fetch the profile data
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <>
      {pageLoaded ? (
        <div
          className={`flex w-full h-full justify-center pl-[10px] pr-[10px] animate__animated animate__fadeIn ${styles.pageContainer}`}
        >
          <div className={`grid ${styles.gridContainer}`}>
            <div className="items-center roundedFormOppositeShadow">
              <p className={`w-fit ${styles.textTitle}`}>
                Edit Profile Picture
              </p>
              <ProfilePicture
                profileImgSrc={profileData["profile_image"]}
                username={profileData["username"]}
                className="m-4"
                backgroundColor="bg-black"
                textColor="text-black"
              />
              <UploadImage
                collection="profiles"
                field="profile_image"
                callback={imageAlertCallback}
              ></UploadImage>
              <Alert
                hidden={imageAlertData["hidden"]}
                message={imageAlertData["message"]}
                borderColor={imageAlertData["borderColor"]}
                backgroundColor={imageAlertData["backgroundColor"]}
                fontColor={imageAlertData["fontColor"]}
                maxWidth={imageAlertData["maxWidth"]}
                toggleHidden={() =>
                  setImageAlertData((prev) => {
                    return { ...prev, hidden: true };
                  })
                }
              ></Alert>
            </div>
            <div className="items-center roundedFormOppositeShadow w-[300px]">
              <p className={`w-fit ${styles.textTitle}`}>Edit Name</p>
              <div className="flex h-[30px] w-full">
                <label className="flex items-center justify-center w-[20%]">
                  Name:{" "}
                </label>
                <input
                  id="name"
                  type="text"
                  maxLength={50}
                  className="p-1 border-2 rounded-xl border-slate-300 w-[80%]"
                  placeholder={profileData.name}
                ></input>
              </div>
              <input
                type="button"
                value="Save"
                className={`neonBlackButton mt-[5px] mb-[5px]`}
                onClick={() => {
                  handleEditName();
                }}
              ></input>
              <Alert
                hidden={nameAlertData["hidden"]}
                message={nameAlertData["message"]}
                borderColor={nameAlertData["borderColor"]}
                backgroundColor={nameAlertData["backgroundColor"]}
                fontColor={nameAlertData["fontColor"]}
                maxWidth={nameAlertData["maxWidth"]}
                toggleHidden={() =>
                  setNameAlertData((prev) => {
                    return { ...prev, hidden: true };
                  })
                }
              ></Alert>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingIcon time={1} tileSize={100} color="#000000"></LoadingIcon>
        </div>
      )}
    </>
  );
}

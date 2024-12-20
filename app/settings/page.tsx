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
import { validatePassword } from "../functions/validatePassword";
import updatePassword from "../functions/updatePassword";

export default function Settings() {
  const profileData = useContext(ProfileDataContext);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [password, setPassword] = useState("");
  // Profile picture alert
  const [imageAlertData, setImageAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });
  // Name alert
  const [nameAlertData, setNameAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });
  // Bio alert
  const [bioAlertData, setBioAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });
  // Password alert
  const [passwordAlertData, setPasswordAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });
  let maxNameLength = 50; // The max number of characters the name can be
  let maxPasswordLength = 128; // The max number of characters the password can be
  let maxBioLength = 150; // The max number of characters the bio can be

  useEffect(() => {
    const passwordLengthRequirement = 8;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]*$/;

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
  }, [password]);

  // Image alert callback
  function imageAlertCallback(info: any) {
    if (info.status == 200) {
      setImageAlertData(
        createAlert({
          type: "success",
          message: "Image Uploaded.",
          hidden: false,
          maxWidth: 400,
        })
      );
      profileData.refetchProfileCallback();
    } else {
      setImageAlertData(
        createAlert({
          type: "error",
          message: "Error Uploading Image",
          hidden: false,
          maxWidth: 400,
        })
      );
    }
  }

  // On save, update the user's name
  async function handleEditName() {
    const name = document.getElementById("name") as HTMLInputElement;
    if (name && name.value) {
      if (name.value.length > 0 && name.value.length <= maxNameLength) {
        const status = await updateDBField(
          process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
          "name",
          name.value
        );
        if (status == 200) {
          setNameAlertData(
            createAlert({
              type: "success",
              message: "Name updated.",
              hidden: false,
              maxWidth: 400,
            })
          );
          const element = document.getElementById("name") as HTMLInputElement;
          element.value = "";
          profileData.refetchProfileCallback();
        } else {
          setNameAlertData(
            createAlert({
              type: "error",
              message: "Error Updating Name",
              hidden: false,
              maxWidth: 400,
            })
          );
        }
      } else {
        setNameAlertData(
          createAlert({
            type: "error",
            message:
              "Name must be between 1 and " + maxNameLength + " characters",
            hidden: false,
            maxWidth: 300,
          })
        );
      }
    } else {
      setNameAlertData(
        createAlert({
          type: "error",
          message:
            "Name must be between 1 and " + maxNameLength + " characters",
          hidden: false,
          maxWidth: 300,
        })
      );
    }
  }

  // On save, update the user's bio
  async function handleEditBio() {
    const bio = document.getElementById("bio") as HTMLInputElement;
    if (bio && bio.value) {
      if (bio.value.length > 0 && bio.value.length <= maxBioLength) {
        const status = await updateDBField(
          process.env.NEXT_PUBLIC_PROFILES_DB_NAME!,
          "bio",
          bio.value
        );
        if (status == 200) {
          setBioAlertData(
            createAlert({
              type: "success",
              message: "Bio updated.",
              hidden: false,
              maxWidth: 400,
            })
          );
          const element = document.getElementById("bio") as HTMLInputElement;
          element.value = "";
          profileData.refetchProfileCallback();
        } else {
          setBioAlertData(
            createAlert({
              type: "error",
              message: "Error Updating Bio",
              hidden: false,
              maxWidth: 400,
            })
          );
        }
      } else {
        setBioAlertData(
          createAlert({
            type: "error",
            message:
              "Bio must be between 1 and " + maxBioLength + " characters",
            hidden: false,
            maxWidth: 300,
          })
        );
      }
    } else {
      setBioAlertData(
        createAlert({
          type: "error",
          message: "Bio must be between 1 and " + maxBioLength + " characters",
          hidden: false,
          maxWidth: 300,
        })
      );
    }
  }

  // On save, update the user's password
  async function handleEditPassword() {
    const status = await validatePassword(password);
    if (status === 420) {
      setPasswordAlertData(
        createAlert({
          type: "error",
          message: "Password too short",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else if (status === 430) {
      setPasswordAlertData(
        createAlert({
          type: "error",
          message: "Password too long",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else if (status === 440) {
      setPasswordAlertData(
        createAlert({
          type: "error",
          message:
            "Password must only contain letters, numbers, or special characters",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else if (status === 460) {
      setPasswordAlertData(
        createAlert({
          type: "error",
          message: "Password must contain at least one letter and one number",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else if (status === 500) {
      setPasswordAlertData(
        createAlert({
          type: "error",
          message: "Error: Please try again",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else {
      const success = await updatePassword(password);
      if (success === 200) {
        setPasswordAlertData(
          createAlert({
            type: "success",
            message: "Password changed",
            hidden: false,
            maxWidth: 300,
          })
        );
      } else {
        setPasswordAlertData(
          createAlert({
            type: "error",
            message: "Error: Please try again",
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
                profileImgSrc={
                  profileData.profile_image
                    ? profileData.profile_image
                    : "/blank-profile-picture.png"
                }
                username={profileData["username"]}
                className="m-4"
                backgroundColor="bg-black"
                textColor="text-black"
              />
              <UploadImage
                collection="profiles"
                field="profile_image"
                type="update"
                multiple={false}
                callback={imageAlertCallback}
                onUpload={null}
                externalImages={null}
                uploadExternally={false}
                disabled={null}
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
                  maxLength={maxNameLength}
                  className="p-1 border-2 rounded-xl border-slate-300 w-[80%]"
                  placeholder={
                    profileData.name ? profileData.name : "Enter a name!"
                  }
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
              <p className={`w-fit mt-[5px] ${styles.textTitle}`}>Edit Bio</p>
              <div className="flex h-[120px] w-full h-[150px]">
                <label className="flex items-center justify-center w-[20%]">
                  Bio:{" "}
                </label>
                <textarea
                  id="bio"
                  maxLength={150}
                  className="p-1 border-2 rounded-xl border-slate-300 w-[80%] h-full resize-none"
                  placeholder={
                    profileData.bio ? profileData.bio : "Create a bio!"
                  }
                ></textarea>
              </div>
              <input
                type="button"
                value="Save"
                className={`neonBlackButton mt-[5px] mb-[5px]`}
                onClick={() => {
                  handleEditBio();
                }}
              ></input>
              <Alert
                hidden={bioAlertData["hidden"]}
                message={bioAlertData["message"]}
                borderColor={bioAlertData["borderColor"]}
                backgroundColor={bioAlertData["backgroundColor"]}
                fontColor={bioAlertData["fontColor"]}
                maxWidth={bioAlertData["maxWidth"]}
                toggleHidden={() =>
                  setBioAlertData((prev) => {
                    return { ...prev, hidden: true };
                  })
                }
              ></Alert>
            </div>
            <div className="items-center roundedFormOppositeShadow w-[300px]">
              <p className={`w-fit ${styles.textTitle}`}>Change Password</p>
              <div className="flex h-[30px] w-full">
                <label className="flex items-center justify-center w-[25%] mr-[10px]">
                  Password:
                </label>
                <input
                  id="password"
                  type="password"
                  maxLength={maxPasswordLength}
                  className="p-1 border-2 rounded-xl border-slate-300 w-[75%]"
                  placeholder={"12345"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></input>
              </div>
              <div className="flex justify-center w-full">
                <p className="!text-[12px] text-red-600 max-w-[300px]">
                  {passwordValidation}
                </p>
              </div>
              <input
                type="button"
                value="Save"
                className={`neonBlackButton mt-[5px] mb-[5px]`}
                onClick={() => {
                  handleEditPassword();
                }}
              ></input>
              <Alert
                hidden={passwordAlertData["hidden"]}
                message={passwordAlertData["message"]}
                borderColor={passwordAlertData["borderColor"]}
                backgroundColor={passwordAlertData["backgroundColor"]}
                fontColor={passwordAlertData["fontColor"]}
                maxWidth={passwordAlertData["maxWidth"]}
                toggleHidden={() =>
                  setPasswordAlertData((prev) => {
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

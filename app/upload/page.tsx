"use client";

import { useState, useRef } from "react";
import UploadImage from "../components/uploadImage/uploadImage";
import createAlert from "../functions/createAlert";
import Alert from "../components/alert/alert";

export default function Upload() {
  const [imageAlertData, setImageAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });

  // Image alert callback
  function uploadAlertCallback(status: number) {
    if (status == 200) {
      setImageAlertData(
        createAlert({
          type: "success",
          message: "Image Uploaded. Please refresh.",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else if (status == 420) {
      setImageAlertData(
        createAlert({
          type: "error",
          message: "Title length must be between 0-50 characters ...",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else {
      setImageAlertData(
        createAlert({
          type: "error",
          message: "Error Uploading Image. Only PNG, JPG, JPEG allowed.",
          hidden: false,
          maxWidth: 300,
        })
      );
    }
  }
  const titleRef = useRef(null);

  return (
    <div>
      <UploadImage
        collection={process.env.NEXT_PUBLIC_POSTS_DB_NAME!}
        field="image"
        type="upload"
        refs={[titleRef]}
        callback={uploadAlertCallback}
      ></UploadImage>
      <input
        type="text"
        name="title"
        minLength={1}
        maxLength={50}
        ref={titleRef}
        placeholder="Title"
      ></input>
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
  );
}

"use client";

import imageToBase64 from "@/app/functions/imageToBase64";
import updateDBField from "@/app/functions/updateDBField";
import { useRef } from "react";

interface UploadImageProps {
  collection: string;
  field: string;
  callback: Function;
}

export default function UploadImage(props: UploadImageProps) {
  const fileUpload = useRef<HTMLInputElement>(null!);

  // Upload the image
  async function handleSubmit() {
    // If the input field is mounted
    if (fileUpload.current) {
      // Fetch the uploaded image
      const image = fileUpload.current.files![0];
      var base64Image;
      // Convert the image to base64 format
      await imageToBase64(image).then((response) => {
        base64Image = response;
      });
      // If the image was converted successfully
      if (base64Image) {
        try {
          // Upload the image to the the database
          const response = await updateDBField(
            props.collection,
            props.field,
            base64Image
          );
          props.callback(response);
        } catch (e) {
          // Image was not uploaded correctly
          console.log(e);
        }
      }
    }
  }
  return (
    <>
      <input
        type="file"
        ref={fileUpload}
        accept="image/png, image/jpg, image/jpeg"
      ></input>
      <input
        className="neonBlackButton"
        type="button"
        value="Upload"
        onClick={() => {
          handleSubmit();
        }}
      ></input>
    </>
  );
}

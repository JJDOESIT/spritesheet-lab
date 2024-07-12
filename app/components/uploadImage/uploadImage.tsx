"use client";

import imageToBase64 from "@/app/functions/imageToBase64";
import updateDBField from "@/app/functions/updateDBField";
import styles from "../uploadImage/uploadImage.module.css";
import { useRef } from "react";
import uploadToDB from "@/app/functions/uploadToDB";
import handleImage from "./uploadImage.server";

interface UploadImageProps {
  collection: string;
  field: string;
  type: string; // upload or update
  refs?: any | null; // array of refs
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
      // If there are any refs passed, add {name: value}
      // to the array. This way we can server side validate
      // the types based on the name.
      var inputs = [];
      if (props.refs) {
        for (let i = 0; i < props.refs.length; i++) {
          const name = props.refs[i].current.name;
          const value = props.refs[i].current.value;
          inputs.push({ [name]: value });
        }
      }
      // Call the server function to handle the image submition
      const status = await handleImage(
        base64Image,
        props.collection,
        props.field,
        props.type,
        inputs
      );
      // Run the callback function
      props.callback(status);
    }
  }
  return (
    <div className="flex flex-col items-center self-start justify-center w-full">
      <input
        className={``}
        type="file"
        ref={fileUpload}
        accept="image/png, image/jpg, image/jpeg"
      ></input>
      <input
        className="neonBlackButton w-fit !pt-[1px] !pb-[1px] !pl-[30px] !pr-[30px] mt-[10px] mb-[10px]"
        type="button"
        value="Upload"
        onClick={() => {
          handleSubmit();
        }}
      ></input>
    </div>
  );
}

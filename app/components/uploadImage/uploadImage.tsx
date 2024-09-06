"use client";

import imageToBase64 from "@/app/functions/imageToBase64";
import { useState, useRef } from "react";
import handleImage from "./uploadImage.server";

interface UploadImageProps {
  collection: string;
  field: string;
  type: string; // upload or update
  refs?: any | null; // array of refs
  multiple: boolean;
  callback: Function;
  onUpload: Function | null;
}

export default function UploadImage(props: UploadImageProps) {
  const fileUpload = useRef<HTMLInputElement>(null!);

  // Function to convert images to base64 format
  async function convertImages() {
    var base64Images: Array<string> = [];
    // If there should only be one image uploaded
    if (!props.multiple) {
      // Fetch the uploaded image
      const image = fileUpload.current.files![0];
      // Convert the image to base64 format
      await imageToBase64(image).then((response) => {
        base64Images.push(response as string);
      });
    }
    // Else if there should be multiple images uploaded
    else {
      for (let index = 0; index < fileUpload.current.files!?.length; index++) {
        await imageToBase64(fileUpload.current.files![index]).then(
          (response) => {
            base64Images.push(response as string);
          }
        );
      }
    }
    return base64Images;
  }

  // Upload the image
  async function handleSubmit() {
    // If the input field is mounted
    if (fileUpload.current) {
      // Convert images
      const base64Images = await convertImages();

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
        base64Images,
        props.collection,
        props.field,
        props.type,
        inputs
      );
      // Run the callback function
      props.callback({ status: status });
    }
  }
  return (
    <div className="flex flex-col items-center self-start justify-center w-full">
      <input
        className={``}
        type="file"
        ref={fileUpload}
        accept="image/png, image/jpg, image/jpeg"
        multiple={props.multiple}
        onChange={async () => {
          if (props.onUpload) {
            props.onUpload(await convertImages());
          }
        }}
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

"use client";

import imageToBase64 from "@/app/functions/imageToBase64";
import { useState, useRef, useEffect } from "react";
import handleImage from "./uploadImage.server";

interface UploadImageProps {
  collection: string;
  field: string;
  type: string; // upload or update
  refs?: any | null; // array of refs
  multiple: boolean;
  callback: Function;
  onUpload: Function | null;
  externalImages: File[] | null;
  uploadExternally: boolean;
  disabled: boolean | null;
}

export default function UploadImage(props: UploadImageProps) {
  const fileUpload = useRef<HTMLInputElement>(null!);
  const [disabled, setDisabled] = useState(props.disabled);

  // Set the disabled status to be that of the parent
  useEffect(() => {
    if (props.disabled != null) {
      setDisabled(props.disabled);
    }
  }, [props.disabled]);

  // Function to convert images to base64 format
  async function convertImagesInternal() {
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

  // Function to convert images to base64 format
  async function convertImagesExternal() {
    var base64Images: Array<string> = [];
    // If there should only be one image uploaded
    if (!props.multiple) {
      // Fetch the uploaded image
      const image = props.externalImages![0];
      // Convert the image to base64 format
      await imageToBase64(image).then((response) => {
        base64Images.push(response as string);
      });
    }
    // Else if there should be multiple images uploaded
    else {
      for (let index = 0; index < props.externalImages!?.length; index++) {
        await imageToBase64(props.externalImages![index]).then((response) => {
          base64Images.push(response as string);
        });
      }
    }
    return base64Images;
  }

  // Whenever the external image array is updated, convert
  // the images to base64 format and send them back
  async function fetchImages() {
    try {
      const images = await convertImagesExternal();
      if (props.onUpload) {
        props.onUpload(images);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }

  // Whenever the external image array is updated, convert
  // the images to base64 format and send them back
  useEffect(() => {
    // If the external image array exists and the length is not 0
    if (props.externalImages && props.externalImages.length != 0) {
      fetchImages();
    } else if (props.onUpload) {
      // Else the cancel button was clicked or images were cleared somehow
      props.onUpload([]);
    }
  }, [props.externalImages]);

  // Upload the image
  async function handleSubmit() {
    // If the prop is not null, we assume we want to disable until the parent allows us again
    if (props.disabled != null) {
      setDisabled(true);
    }
    // If the input field is mounted
    if (fileUpload.current) {
      var base64Images;

      // Convert images internally
      if (!props.uploadExternally) {
        // Check to make sure an image was uploaded
        if (fileUpload.current.files!.length != 0) {
          base64Images = await convertImagesInternal();
        }
        // No image was uploaded
        else {
          props.callback({ status: 404 });
          return;
        }
      }
      // Convert images externally
      else {
        // Check to make sure an image was uploaded
        if (props.externalImages!.length != 0) {
          base64Images = await convertImagesExternal();
        }
        // No image was uploaded
        else {
          props.callback({ status: 404 });
          return;
        }
      }

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
            props.onUpload(await convertImagesInternal());
          }
        }}
        style={props.uploadExternally ? { display: "none" } : {}}
      ></input>
      <input
        disabled={disabled}
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

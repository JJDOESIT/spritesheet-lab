"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import LoadingIcon from "../components/loadingIcon/loadingIcon";
import UploadImage from "../components/uploadImage/uploadImage";
import createAlert from "../functions/createAlert";
import Alert from "../components/alert/alert";
import styles from "../upload/upload.module.css";

export default function Upload() {
  const [animated, setAnimated] = useState(false);
  const [images, setImages] = useState([]);
  const [imageAlertData, setImageAlertData] = useState({
    hidden: true,
    message: "",
    borderColor: "",
    backgroundColor: "",
    fontColor: "",
    maxWidth: 0,
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [disableUpload, setDisableUpload] = useState(false);
  const titleRef = useRef(null);
  const speedRef = useRef(null);

  // Function to shift images left or right in the array
  function shiftImage(direction: string) {
    if (direction === "left") {
      const image = images[selectedImageIndex];
      if (selectedImageIndex != 0) {
        setImages((prev) => {
          let data = [...prev];
          data.splice(selectedImageIndex, 1);
          data.splice(selectedImageIndex - 1, 0, image);
          return data;
        });
        setSelectedImageIndex(selectedImageIndex - 1);
      } else {
        setImages((prev) => {
          let data = [...prev];
          data.splice(selectedImageIndex, 1);
          data.splice(images.length - 1, 0, image);
          return data;
        });
        setSelectedImageIndex(images.length - 1);
      }
    } else if (direction === "right") {
      const image = images[selectedImageIndex];
      if (selectedImageIndex != images.length - 1) {
        setImages((prev) => {
          let data = [...prev];
          data.splice(selectedImageIndex, 1);
          data.splice(selectedImageIndex + 1, 0, image);
          return data;
        });
        setSelectedImageIndex(selectedImageIndex + 1);
      } else {
        setImages((prev) => {
          let data = [...prev];
          data.splice(selectedImageIndex, 1);
          data.splice(0, 0, image);
          return data;
        });
        setSelectedImageIndex(0);
      }
    }
  }

  // Set the selected image index to 0 once an image has been uploaded
  useEffect(() => {
    if (images) {
      if (images.length === 0) {
        setSelectedImageIndex(0);
      }
    }
  }, [images]);

  // Image callback to fetch the images when they're uploaded for display purposes
  function fetchImages(images: any) {
    setImages(images);
  }

  // Image alert callback
  function uploadAlertCallback(info: any) {
    if (info.status == 200) {
      setImages([]);
      setImageAlertData(
        createAlert({
          type: "success",
          message: "Image Uploaded. Please refresh.",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else if (info.status == 404) {
      setImageAlertData(
        createAlert({
          type: "error",
          message: "Please select an image ...",
          hidden: false,
          maxWidth: 300,
        })
      );
    } else if (info.status == 420) {
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
    // Clear the file cache
    const inputElement = document.getElementById(
      "externalUpload"
    ) as HTMLInputElement;
    inputElement.value = "";
    setImages([]);
    setUploadedImages([]);

    // Allow for another image to be uploaded
    setDisableUpload(true);
  }

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  // Hacky solution to force a disabled refresh
  useEffect(() => {
    if (disableUpload) {
      setDisableUpload(false);
    }
  }, [disableUpload]);

  return (
    <>
      {pageLoaded ? (
        <div className="flex flex-col items-center w-full overflow-x-hidden overflow-y-scroll p-[10px]">
          <div className={`${styles.imageContainer} w-full max-h-[70%]`}>
            <div className={`${styles.imageGrid} relative`}>
              <input
                type="file"
                id="externalUpload"
                accept="image/png, image/jpg, image/jpeg"
                className="absolute w-full h-full z-[2] hover:cursor-pointer"
                style={{ opacity: "0" }}
                onChange={(event) => {
                  if (event.target.files) {
                    setUploadedImages(Array.from(event.target.files));
                  }
                }}
                multiple={animated}
              ></input>
              <div
                className={`${styles.uploadIconContainer}`}
                style={{ display: images.length === 0 ? "" : "none" }}
              >
                <ArrowUpIcon></ArrowUpIcon>
                <p className="font-bold">Drag & drop any file here</p>
                <p>
                  or <span className="text-[#C979E8]">browse</span> file from
                  device
                </p>
              </div>
              {images &&
                images.length > 0 &&
                images.map((item, index) => {
                  if (item) {
                    return (
                      <img
                        id={index.toString()}
                        src={item}
                        className={
                          selectedImageIndex === index
                            ? `${styles.selectedImage} w-full`
                            : "w-full z-[2]"
                        }
                        onClick={() => {
                          setSelectedImageIndex(index);
                        }}
                      ></img>
                    );
                  }
                })}
            </div>
          </div>
          <div className="flex items-center justify-center w-full mt-[10px]">
            <div
              className={`${styles.clearButton}`}
              onClick={() => {
                const inputElement = document.getElementById(
                  "externalUpload"
                ) as HTMLInputElement;
                inputElement.value = "";
                setImages([]);
                setUploadedImages([]);
              }}
            >
              Clear
            </div>
            <div className={`${styles.shiftImage}`}>
              <div>
                <input
                  type="button"
                  value="Shift Left"
                  onClick={() => {
                    shiftImage("left");
                  }}
                ></input>
              </div>

              <div>
                <input
                  type="button"
                  value="Shift Right"
                  onClick={() => {
                    shiftImage("right");
                  }}
                ></input>
              </div>
            </div>
          </div>

          <div className={`${styles.uploadInfoContainer}`}>
            <table className="">
              <tr>
                <td>
                  <label className="text-xl pl=[100px]">Title: </label>
                </td>
                <td>
                  <input
                    className={`${styles.title}`}
                    type="text"
                    name="title"
                    minLength={1}
                    maxLength={50}
                    ref={titleRef}
                    placeholder="Title"
                  ></input>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="text-xl">Animated: </label>
                </td>
                <td>
                  <div className={`${styles.checkboxWrapper}`}>
                    <label className={`${styles.toggleButton}`}>
                      <input
                        type="checkbox"
                        onClick={() => {
                          setAnimated((prev) => {
                            return !prev;
                          });
                        }}
                      ></input>
                      <div>
                        <svg viewBox="0 0 44 44">
                          <path
                            d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758"
                            transform="translate(-2.000000, -2.000000)"
                          ></path>
                        </svg>
                      </div>
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="text-xl">Speed: </label>
                </td>
                <td>
                  <input
                    name="speed"
                    type="number"
                    ref={speedRef}
                    defaultValue={animated ? 1 : 0}
                    disabled={!animated}
                    className={`${styles.speed}`}
                  ></input>
                </td>
              </tr>
            </table>
            <div className="mt-[10px]">
              <UploadImage
                collection={process.env.NEXT_PUBLIC_POSTS_DB_NAME!}
                field="image"
                type="upload"
                refs={[titleRef, speedRef]}
                multiple={animated}
                callback={uploadAlertCallback}
                onUpload={fetchImages}
                externalImages={uploadedImages}
                uploadExternally={true}
                disabled={disableUpload}
              ></UploadImage>
              <div className="mb-[5px]">
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

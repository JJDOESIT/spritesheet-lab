"use server";

import validateText from "@/app/functions/validateText";
import updateDBField from "@/app/functions/updateDBField";
import uploadToDB from "@/app/functions/uploadToDB";

export default async function handleImage(
  base64Image: any,
  collection: string,
  field: string,
  type: string,
  inputs: any
) {
  var status;
  const titleMinLegth = 0;
  const titleMaxLength = 50;

  const transformedInputs: any = {};

  try {
    // Iterate through given inputs
    for (let i = 0; i < inputs.length; i++) {
      // Get key, pair value of dict
      for (const [key, value] of Object.entries(inputs[i])) {
        // If the input is a title
        if ((key as string) === "title") {
          // Validate the text input
          const isValid = await validateText(
            value as string,
            titleMinLegth,
            titleMaxLength
          );
          // If the input is not valid -> return 400
          if (!isValid) {
            return 420;
          } else {
            transformedInputs[key] = value;
            // Set default values for likes and speed for posts
            transformedInputs["likes"] = 0;
            transformedInputs["speed"] = null;
          }
        }
        // If the input is speed
        else if ((key as string) === "speed") {
          // If the input is a number
          if (typeof Number(value) == "number") {
            transformedInputs[key] = Number(value);
          }
        }
        // The input type isn't valid -> return 400
        else {
          return 400;
        }
      }
    }

    if (base64Image) {
      if (type === "update") {
        // Upload the image to the the database
        status = await updateDBField(collection, field, base64Image);
      } else if (type === "upload") {
        // Upload the image to the the database
        status = await uploadToDB(collection, {
          image: base64Image,
          inputs: transformedInputs,
        });
      } else {
        // Upload type not defined -> return 410
        status = 410;
      }
    } else {
      // Image not valid or doesn't exist -> return 405
      status = 405;
    }
  } catch (e) {
    // Could not upload or update image -> return 500
    status = 500;
    console.log(e);
  }
  return status;
}

export default async function imageToBase64(image: any) {
  // If the image exists
  if (image) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        // Convert image to base64
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
        return null;
      };
    });
  } else {
    return null;
  }
}

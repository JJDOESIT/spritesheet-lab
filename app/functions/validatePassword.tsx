"use server";

export async function validatePassword(password: string) {
  var status = 200;
  try {
    const passwordLengthRequirement = 8;
    const passwordMaxLengthRequirement = 128;
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]*$/;

    // Password too short -> return 420
    if (password.length < passwordLengthRequirement) {
      status = 420;
    }
    // Password too long -> return 430
    else if (password.length > passwordMaxLengthRequirement) {
      status = 430;
    }
    // Password must only contain numbers, letters, and special characters -> return 440
    else if (!passwordRegex.test(password)) {
      status = 440;
    }
    // Password must contain at least one number and one letter
    else if (
      !/^(?=.*\d).+$/.test(password) ||
      !/^(?=.*[a-zA-Z]).*$/.test(password)
    ) {
      status = 460;
    }
  } catch (e) {
    // Function error -> return 500
    console.log(e);
    status = 500;
  }
  return status;
}

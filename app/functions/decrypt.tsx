import bcrypt from "bcrypt";

// Decrypt a password given a has
export default function decrypt(password: string, hash: string) {
  return new Promise((resolve, reject) => {
    // Decryption logic
    bcrypt.compare(password, hash, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

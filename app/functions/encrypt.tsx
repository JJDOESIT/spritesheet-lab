import bcrypt from "bcrypt";

// Use salt and hashing to encrypt a given password
export default function encrypt(password: string, saltRounds: number) {
  return new Promise((resolve, reject) => {
    // Encryption logic
    bcrypt.hash(password, saltRounds, (error, hash) => {
      if (error) {
        reject(error);
      } else {
        resolve(hash);
      }
    });
  });
}

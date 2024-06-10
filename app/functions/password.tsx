import bcrypt from "bcrypt";

// Use salt and hashing to encrypt a given password
export async function passwordEncrypt(password: string, saltRounds: number) {
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

// Decrypt a password given a has
export async function passwordDecrypt(password: string, hash: string) {
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

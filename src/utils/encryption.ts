// utils/encryption.ts
import CryptoJS from 'crypto-js';

const secretKey = 'a5e28ef45588a3ec41e12c57b4d8684df18af4a29039851e1d55a82fbb5ca8de'; 

const key = CryptoJS.enc.Hex.parse(secretKey);

// export const encryptPassword = (plainPassword: string): string => {
//   return CryptoJS.AES.encrypt(plainPassword, secretKey).toString();
// };

export const encryptPassword = (plainPassword: string): string => {
  // Generate a random 16-byte IV
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt using AES-CBC
  const encrypted = CryptoJS.AES.encrypt(plainPassword, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert IV to hex and ciphertext to base64
  const ivHex = iv.toString(CryptoJS.enc.Hex);
  const cipherTextBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);  
  // Return in the format expected by the backend: iv_hex:base64_encrypted
  return `${ivHex}:${cipherTextBase64}`;
};

export const decryptPassword = (encrypted: string): string => {
  const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

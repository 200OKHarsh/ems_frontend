import CryptoJS from "crypto-js";

const CRYPTO_KEY = 'dragon-ball-z'

export const encryptAES = (data: string) => {
  if (data) {
    return CryptoJS.AES.encrypt(data, CRYPTO_KEY).toString();
  }
  return data;
};
export const decryptionAES = (data: string) => {
  try {
    if (data) {
      const bytes = CryptoJS.AES.decrypt(data, CRYPTO_KEY);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedText) {
        return decryptedText;
      } else {
        return "";
      }
    }
    return data;
  } catch (error) {
    console.log({ error });
  }
};
import CryptoJS from 'crypto-js';
import { proxyStringManager, proxyStringKey } from '../../common/const.config';

export const aesDecrypt = (data) => {
  try {
    var decrypted = CryptoJS.AES.decrypt(proxyStringManager, proxyStringKey);
    const secretKey = decrypted.toString(CryptoJS.enc.Utf8);
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.log(error);
    return null;
  }
};

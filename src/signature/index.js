import SHA256 from 'crypto-js/sha256';
import { masterKey } from '../common/const.config';
import { URL_API } from '../common/const.api';

export const generateURL = (path) => {
  const expires = new Date().getTime() + 60 * 1000;
  const signature = SHA256(`${masterKey}/${path}?expires=${expires}`);
  return `${URL_API}${path}?expires=${expires}&signature=${signature}`;
};

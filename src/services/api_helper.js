import { CODE, EMAIL, FORGOT, USERS } from '../common/const.api';
import HttpService from './http-service';

const http = new HttpService();

export const apiCreateAccount = async (email, password, phone) => {
  const body = {
    email,
    password,
    phone,
  };
  return await http.post(USERS, { body });
};
export const apiSendCode = async (email) => {
  const body = {
    email,
  };
  return await http.post(EMAIL, { body });
};

export const apiCheckCode = async (email, code) => {
  const body = {
    email,
    code,
  };
  return await http.post(CODE, { body });
};

export const apiChangePass = async (email, code, newPassword) => {
  const body = {
    email,
    code,
    newPassword,
  };
  return await http.post(FORGOT, { body });
};

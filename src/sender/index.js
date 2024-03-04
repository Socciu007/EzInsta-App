import { Promise } from 'bluebird';
const API_TIMEOUT = 30000;

export const dbSetLocally = (key, value) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-set-db', { key, value });
      window.electron.ipcRenderer.once('ipc-set-db', resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const dbGetLocally = (key) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-get-db', { key });
      window.electron.ipcRenderer.once('ipc-get-db' + key, resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const login = (username, password) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-login', { username, password });
      window.electron.ipcRenderer.once('ipc-login', resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const getMe = () =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-get-me');
      window.electron.ipcRenderer.once('ipc-get-me', resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const getProfilesMarco = () =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-get-profiles');
      window.electron.ipcRenderer.once('ipc-get-profiles', resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const getBrowserData = (id, proxy) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-get-browser-data', { id, proxy });
      window.electron.ipcRenderer.once('ipc-get-browser-data' + id, resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const deleteProfile = (id) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-delete-profile', { id });
      window.electron.ipcRenderer.once('ipc-delete-profile' + id, resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const createProfile = (name, proxy) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-create-profile', { name, proxy });
      window.electron.ipcRenderer.once('ipc-create-profile', resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const updateProfile = (id, proxy) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-update-profile', { id, proxy });
      window.electron.ipcRenderer.once('ipc-update-profile', resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const getProxy = (proxy, id) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-convert-proxy', { id, proxy });
      window.electron.ipcRenderer.once(`ipc-convert-proxy${id ? id : ''}`, resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, 10000);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const runProfile = (code, id) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-run-profile', { code, id });
      window.electron.ipcRenderer.once(`ipc-run-profile${id ? id : ''}`, resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, 1200000);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const getAxiosWithProxy = (url, proxy) =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-axios-proxy', { url, proxy });
      window.electron.ipcRenderer.once(`ipc-axios-proxy${url ? url : ''}`, resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, API_TIMEOUT);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const getInformation = () =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-get-information');
      window.electron.ipcRenderer.once(`ipc-get-information`, resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, 10000);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

export const getWindowsize = () =>
  new Promise((resolve) => {
    try {
      window.electron.ipcRenderer.sendMessage('ipc-getWindowSize');
      window.electron.ipcRenderer.once(`ipc-getWindowSize`, resolve);
      setTimeout(() => {
        resolve({ success: false, error: 'Timeout!' });
      }, 10000);
    } catch (error) {
      resolve({ success: false, error });
    }
  });

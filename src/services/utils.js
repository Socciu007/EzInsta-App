import moment from 'moment';

export const formatTime = (date) => {
  return moment(date).format('HH:mm:ss DD/MM/YYYY');
};

export const formatTimeHour = (date) => {
  return moment(date).format('HH:mm:ss');
};

export const formatTimeDay = (date) => {
  return moment(date).format(' DD/MM/YYYY');
};

export const formatBytes = (bytes, decimals = 2) => {
  let newBytes = bytes;
  if (bytes < 0) {
    newBytes = bytes * -1;
  }
  if (!+newBytes) return '0 Bytes';

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(newBytes) / Math.log(k));

  return `${bytes < 0 ? '-' : ''}${parseFloat((newBytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// export const parseToNumber = (value) => {
//   const isNumber = /^\d*$/.test(value);
//   if (isNumber) {
//     return value > 0 ? value : 0;
//   } else {
//     return parseInt(value) > 0 ? parseInt(value) : 0;
//   }
// };

export const parseToNumber = (value) => {
  const isNumber = /^\d+$/.test(value);

  if (isNumber) {
    return parseInt(value, 10);
  } else {
    return parseInt(value) >= 0 ? parseInt(value) : 0;
  }
};

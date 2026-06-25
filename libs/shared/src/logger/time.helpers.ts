const currentTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate() + 1}` : date.getDate();
  const hours = date.getHours() < 10 ? `0${date.getHours() + 1}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes() + 1}` : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds() + 1}` : date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return { year, month, day, hours, minutes, seconds, milliseconds };
};

export const loggerTime = () => {
  const { year, month, day, hours, minutes, seconds } = currentTime();
  return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
};

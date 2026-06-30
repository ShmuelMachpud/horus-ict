const reverseWord = (str: string) => str.split('').reverse().join('');

export const changeDirToRtl = (str: string) =>
  str
    .split(' ')
    .map((word) => reverseWord(word))
    .reverse()
    .join(' ');

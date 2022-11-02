/* eslint-disable radix */
export const getColor = () => {
  const color = parseInt(`0x${Math.floor(Math.random() * (0xffffff + 1))
    .toString(16)
    .padStart(6, '0')}`); // in case the number is too small to fill 6 hex digits
  return color;
};

// const randomColor = '0x' + Math.floor(Math.random()*16777215).toString(16);

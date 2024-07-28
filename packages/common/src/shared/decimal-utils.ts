const getFraction = (number: string, decimalIndex: number) => {
  if (decimalIndex === -1) return "";
  return number.slice(decimalIndex + 1);
};

const getWhole = (number: string, decimalIndex: number) => {
  if (decimalIndex === -1) return number;
  return number.slice(0, decimalIndex);
};

export const splitDecimalNumber = (number: string) => {
  const decimalIndex = number.indexOf(".");
  const whole = getWhole(number, decimalIndex);
  const fraction = getFraction(number, decimalIndex);
  return { whole, fraction };
};

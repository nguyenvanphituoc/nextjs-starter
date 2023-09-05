import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

export function toSnakeCase(str) {
  const strArr = str.split(" ");
  const snakeArr = strArr.reduce((acc, val) => {
    return acc.concat(val.toLowerCase());
  }, []);
  return snakeArr.join("_");
}

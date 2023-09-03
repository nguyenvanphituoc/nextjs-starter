import { twMerge } from "tailwind-merge";
import { ClassValue, clsx } from "clsx";

export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateGraphIds(): string {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
}

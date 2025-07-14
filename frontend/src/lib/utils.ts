import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import makeClient from "./apollo/apolloProvider";
import {
  GET_COUNTRIES,
  GET_EMIRATES,
  GetCountriesType,
  GetEmiratesType,
} from "./apollo/query/query";
import { CategoryTree, Country, Emirates } from "@/generated/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number
) {
  let timeoutId: NodeJS.Timeout;

  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export const deepEquals = <T>(obj1: T, obj2: T): boolean => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;

  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;
  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);
  if (isArray1 && isArray2) {
    const firstLenght = obj1.length;
    const secondLenght = obj2.length;
    const hasSameLength = firstLenght === secondLenght;
    if (!hasSameLength) return false;
    const isBlankArray = firstLenght === 0;
    let equal = isBlankArray || false;
    for (let index = 0; index < obj1.length; index += 1) {
      const element1 = obj1[index];
      const element2 = obj2[index];
      equal = deepEquals(element1, element2);
      if (!equal) break;
    }
    return equal;
  }
  if (isArray1 || isArray2) return false;
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const hasSameKeys = keys1.length === keys2.length;
  if (!hasSameKeys) return false;
  const isBlankObject = keys1.length === 0;
  let equal = isBlankObject || false;
  for (let index = 0; index < keys1.length; index += 1) {
    const key = keys1[index];
    const element1 = obj1[key as keyof T];
    const element2 = obj2[key as keyof T];
    equal = deepEquals(element1, element2);
    if (!equal) {
      break;
    }
  }
  return equal;
};

export function trimFirstSentence(text: string): string {
  if (text) {
    const firstSpaceIndex = text.indexOf(" ");

    // Find the index of the second space, starting from after the first space
    const secondSpaceIndex = text.indexOf(" ", firstSpaceIndex + 1);

    // If there is no second space, return the entire string
    if (secondSpaceIndex === -1) {
      return text;
    }

    // Return the substring from the start to the first space
    // console.log("actual string", text);

    return text.substring(0, secondSpaceIndex);
  }
  return "";
}
export function hasDeepChildren(item: CategoryTree, depth: number): boolean {
  if (depth <= 0) return true;
  return (
    item.children?.some((child) =>
      hasDeepChildren(child as CategoryTree, depth - 1)
    ) ?? false
  );
}

export const getCountryCodes = async (): Promise<Country[]> => {
  const client = makeClient();
  try {
    const response = client.query<GetCountriesType["Response"]>({
      query: GET_COUNTRIES,
    });
    const countries = (await response).data.countries;

    return countries;
  } catch (err) {
    throw err;
  }
};
export const getEmirates = async (): Promise<Emirates[]> => {
  const client = makeClient();
  try {
    const response = client.query<GetEmiratesType["Response"]>({
      query: GET_EMIRATES,
    });
    const emirates = (await response).data.getEmirates;

    return emirates;
  } catch (err) {
    throw err;
  }
};

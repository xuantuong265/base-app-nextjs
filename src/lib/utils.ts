"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmpty(obj: any): boolean {
  if (obj?.length || obj?.size) return false;

  if (typeof obj !== "object" || obj === null) return true;

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) return false;
  }

  return true;
}

export function concat<T>(...args: (T | T[])[]): T[] {
  return args.flat() as T[];
}

export function joinStrings(array: string[], separator: string): string {
  return array.join(separator);
}

export function slice<T>(arr: T[], start: number, end?: number): T[] {
  return [...arr.slice(start, end)];
}

export function size(item: Record<string, any> | { length: number }): number {
  if (item.constructor === Object) {
    return Object.keys(item).length;
  }

  return item.length;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
  { leading }: { leading?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout>;
  let shouldInvoke: boolean = false;

  return (...args: Parameters<T>) => {
    shouldInvoke = true;

    if (!timerId && leading) {
      func(...args);
      shouldInvoke = false;
    }

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      if (shouldInvoke) {
        func(...args);
      }
    }, delay);
  };
}

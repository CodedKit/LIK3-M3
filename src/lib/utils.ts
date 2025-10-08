import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ALLOWED_IMAGE_HOSTNAMES = [
  'placehold.co',
  'images.unsplash.com',
  'picsum.photos',
  'i.imgur.com',
  'i.giphy.com',
  'media2.giphy.com',
  // Add any other hostnames from next.config.js here
];

export function isHostnameAllowed(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_IMAGE_HOSTNAMES.includes(hostname);
  } catch (error) {
    return false; // Invalid URL
  }
}

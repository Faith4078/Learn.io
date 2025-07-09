import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim()
    .slice(0, 100);
}

export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}`;

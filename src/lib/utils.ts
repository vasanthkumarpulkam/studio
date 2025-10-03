import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple in-memory rate limiter (client-side best-effort)
const lastActionTimes: Record<string, number[]> = {};

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const times = (lastActionTimes[key] || []).filter(t => t > windowStart);
  if (times.length >= limit) {
    lastActionTimes[key] = times; // prune
    return true;
  }
  times.push(now);
  lastActionTimes[key] = times;
  return false;
}

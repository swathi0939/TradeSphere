import { MOCK_DELAY_MULTIPLIER } from '@/config/env';

/** Simulates network latency for mock API calls. `ms` is scaled by
 * `MOCK_DELAY_MULTIPLIER` (`VITE_MOCK_DELAY_MULTIPLIER`) so a demo/QA
 * environment can speed up (`0`) or slow down (`>1`) every mock service at
 * once, without touching the ~40 individual call sites. */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms * MOCK_DELAY_MULTIPLIER));
}

/** Deterministic pseudo-random generator (mulberry32) so demo data is stable across renders/reloads. */
export function seededRandom(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function randomBetween(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(randomBetween(rng, min, max + 1));
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  const item = items[Math.floor(rng() * items.length)];
  if (item === undefined) throw new Error('pick() called with an empty array');
  return item;
}

/** Generates a smooth-ish random-walk sparkline for a given seed. */
export function generateSparkline(seed: string, points = 24, volatility = 0.02): number[] {
  const rng = seededRandom(hashString(seed));
  const series: number[] = [];
  let value = 100;
  for (let i = 0; i < points; i++) {
    value *= 1 + randomBetween(rng, -volatility, volatility);
    series.push(Number(value.toFixed(2)));
  }
  return series;
}

export function formatCurrency(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function daysAgoISO(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

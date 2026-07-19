/** Formats a count-up number with an optional prefix/suffix, Indian digit grouping. */
export function formatCount(value: number, prefix = '', suffix = ''): string {
  return `${prefix}${Math.round(value).toLocaleString('en-IN')}${suffix}`;
}

/** Formats a rupee amount with a +/- sign, used for the live P&L ticker. */
export function formatSignedRupees(value: number): string {
  const sign = value >= 0 ? '+' : '-';
  return `${sign}₹${Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

/** Cubic ease-out, matches the original count-up easing curve. */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Clamps a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** True when the user's OS/browser requests reduced motion. */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True on devices with a fine pointer and real hover (i.e. not touch). */
export function getSupportsHover(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Joins conditional class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

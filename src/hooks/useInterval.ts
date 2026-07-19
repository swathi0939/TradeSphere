import { useEffect, useRef } from 'react';

/** Runs `callback` every `delayMs` — pass `null` to pause. The callback ref is
 * kept fresh without restarting the interval, so callers don't need to
 * memoize it themselves. */
export function useInterval(callback: () => void, delayMs: number | null): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (delayMs === null) return;
    const id = setInterval(() => callbackRef.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs]);
}

export type MarketStatusValue = 'open' | 'pre-open' | 'closed';

export interface MarketStatus {
  status: MarketStatusValue;
  label: string;
}

const MARKET_OPEN_MINUTES = 9 * 60 + 15; // 9:15 IST
const MARKET_CLOSE_MINUTES = 15 * 60 + 30; // 15:30 IST
const PRE_OPEN_MINUTES = 9 * 60; // 9:00 IST

/** NSE-hours market status (Mon-Fri 9:15-15:30 IST, with a 9:00-9:15 pre-open
 * window), computed from real wall-clock time regardless of the browser's
 * own timezone — this is a pure function, safe to call from both UI and
 * services. */
export function getMarketStatus(now: Date = new Date()): MarketStatus {
  const istParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);

  const weekday = istParts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(istParts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(istParts.find((p) => p.type === 'minute')?.value ?? 0);
  const minutesSinceMidnight = hour * 60 + minute;

  const isWeekday = !['Sat', 'Sun'].includes(weekday);

  if (isWeekday && minutesSinceMidnight >= MARKET_OPEN_MINUTES && minutesSinceMidnight < MARKET_CLOSE_MINUTES) {
    return { status: 'open', label: 'Market Open' };
  }

  if (isWeekday && minutesSinceMidnight >= PRE_OPEN_MINUTES && minutesSinceMidnight < MARKET_OPEN_MINUTES) {
    return { status: 'pre-open', label: 'Pre-Open' };
  }

  return { status: 'closed', label: 'Market Closed' };
}

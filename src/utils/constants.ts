export const SITE_NAME = 'TradeSphere';
export const SITE_TAGLINE = 'Trade Smarter. Invest Faster.';

export const THEME_STORAGE_KEY = 'tradesphere-theme';
export const ANNOUNCE_DISMISSED_KEY = 'tradesphere-announce-dismissed';

/** Scroll offset (px) past which the sticky header condenses. */
export const HEADER_SCROLL_THRESHOLD = 20;
/** Scroll offset (px) past which the back-to-top button appears. */
export const BACK_TO_TOP_THRESHOLD = 600;

export const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Markets', href: '#charts' },
  { label: 'About', href: '#footer' },
] as const;

export const HERO_CANDLE_COUNT = 26;
export const HERO_BASE_PRICE = 22458.3;
export const HERO_TICK_INTERVAL_MS = 2200;
export const INDICATOR_POINT_COUNT = 60;
export const INDICATOR_TICK_INTERVAL_MS = 1800;
export const LOADER_HIDE_DELAY_MS = 550;

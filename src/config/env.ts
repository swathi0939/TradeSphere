/** Centralized, typed access to build-time environment configuration — the
 * single place pages/services read `import.meta.env` from, so a later swap
 * to real environment-driven config (a real API base URL, feature flags,
 * etc.) touches one file, not every call site. */
export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'TradeSphere';

export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '1.0.0';

export const BUILD_TIME = typeof __BUILD_TIME__ === 'string' ? __BUILD_TIME__ : new Date().toISOString();

const parsedMockDelayMultiplier = Number(import.meta.env.VITE_MOCK_DELAY_MULTIPLIER);

/** Multiplier applied to every mock service's simulated network latency —
 * defaults to 1 (unchanged). Set `VITE_MOCK_DELAY_MULTIPLIER=0` for
 * instant responses in demos, or `>1` to simulate a slower network. */
export const MOCK_DELAY_MULTIPLIER = Number.isFinite(parsedMockDelayMultiplier) && parsedMockDelayMultiplier >= 0 ? parsedMockDelayMultiplier : 1;

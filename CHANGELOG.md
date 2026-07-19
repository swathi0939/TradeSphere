# Changelog

All notable changes to this project, grouped by phase. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## Phase 6 — Production Readiness (current)

**Product Experience**
- New public pages: About, Contact, FAQ (reuses the landing page's `sections/FAQ.tsx` verbatim), each via a new `MarketingLayout`.
- 4-step guided onboarding tour on first authenticated dashboard visit (`localStorage`-gated, shown once).
- New shared `EmptyState` component; applied to the Watchlist page's empty state.
- Fixed 3 dead/same-page-only footer/nav links on the landing page to point at the new real pages (data-value changes only — no visual change to the frozen landing page itself).

**Reports & Sharing**
- Printable report/snapshot pages (native browser print-to-PDF via `window.print()`, no new dependency) behind a new chrome-free `PrintLayout`.
- Print and Share (Web Share API + clipboard fallback) buttons on the Workspace page's saved reports/snapshots.

**Performance**
- `framer-motion` split into its own vendor chunk — a real ~126 kB reduction in the main entry chunk (see `docs/PERFORMANCE.md`).
- `React.memo` added to 3 list-row components (`MarketCard`, `NotificationCard`, `TimelineItem`).
- `rollup-plugin-visualizer` wired in behind `npm run build:analyze`.
- Confirmed route-level code-splitting was already comprehensive (34 lazy-loaded routes) — no rework needed.

**Reliability**
- App-wide `ErrorBoundary` (class component) + React Router `errorElement`s on every layout branch.
- New 404 page wired as the router's catch-all.
- Offline detection (`useOnlineStatus` + `OfflineBanner`), mounted in the dashboard shell.
- New `AsyncError` retry component, wired into 3 flagship pages (`DashboardOverviewPage`, `MarketsPage`, `PortfolioDoctorPage`) — surfaces `useAsync`'s `error`/`refetch`, which every page had access to already but none rendered.
- Fade-in polish on the lazy-route loading spinner.

**Deployment Readiness**
- Typed environment config (`src/config/env.ts`, `.env.example`), with `VITE_MOCK_DELAY_MULTIPLIER` wired into `mockUtils.ts`'s `delay()`.
- `.github/workflows/ci.yml` (type-check + lint + build on push/PR).
- New `/health` client-side status page.

**Documentation**
- This changelog, plus `docs/ARCHITECTURE.md`, `docs/FOLDER_STRUCTURE.md`, `docs/COMPONENTS.md`, `docs/SERVICES.md`, `docs/INSTALLATION.md`, `docs/DEPLOYMENT.md`, `docs/PERFORMANCE.md`, `CONTRIBUTING.md`, and a full `README.md` rewrite.

## Phase 5 — Live Market Center, AI News Intelligence, Watchlists & Smart Alerts, User Workspace

- Live-ticking prices, market open/closed status, auto-refresh, and a "Market Movers" strip added to the existing Markets page.
- AI News Intelligence: sentiment breakdown, trending topics, AI digest, company-specific filtering.
- Multiple named watchlist groups (a new, separate system from the original single default watchlist), price alerts, portfolio alerts, AI recommendations.
- User Workspace: saved portfolio snapshots, saved AI reports, CSV export (real) + CSV import (client-side preview).

## Phase 4 — Portfolio Risk Analytics, Diversification & Correlation, Performance Attribution, Scenario & Stress Testing

- Rolling volatility, drawdown curve, historical VaR, per-asset risk contribution.
- Stock-to-stock correlation matrix, sector exposure heatmap, reused the existing diversification-score math.
- Best/worst performers, sector P&L contribution, realized vs. unrealized gains, benchmark comparison.
- 5 macro stress-test scenarios applied to real per-sector holdings.

## Phase 3 — Portfolio Health Dashboard, AI Portfolio Rebalancer, AI Investment Calendar, AI Strategy Builder

- Read-only portfolio health rollup composing several existing hooks.
- Interactive sector-target rebalancing with concrete buy/sell deltas.
- Month-grid calendar of earnings/dividends/AI review reminders/market holidays.
- Strategy-template-based stock screening across the mock universe.

## Phase 2 — What-If Simulator, AI Timeline, AI Goal Planner, Future Wealth Forecast

- Live-recompute investment scenario simulator.
- Unified chronological feed of AI insights, trades, and market moves.
- Goal-seeking contribution calculator with feasibility grading.
- Long-range wealth projection with milestone markers.

## Phase 1 — AI Portfolio Doctor, AI Daily Brief, AI Market Explainer, AI Copilot

- Real (non-random) portfolio diagnosis: HHI-based diversification score, concentration warnings, suggestions.
- Composed daily narrative brief across portfolio/sentiment/news/insights.
- Rule-based (not LLM) explanation for individual stock price moves.
- Pattern-matching chat assistant.

## Core (pre-Phase-1)

- Marketing landing page (pixel-parity port from static HTML).
- Auth flow (mock, `localStorage`-backed sessions).
- Dashboard shell: Portfolio, Markets, Trading, Watchlist, Orders, Holdings, Analytics.

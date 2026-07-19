# Folder Structure

Feature-based, not type-based-only. All paths are relative to `src/`.

```
assets/              Icons/images/logos (mostly empty — icons are inline via lucide-react)
components/          Shared UI primitives (components/ui/*: Button, Card, Input, Table, Modal, …)
components/charts/   Canvas/SVG chart components (candlesticks, sparklines, donut/bar/line charts)
components/motion.ts Shared Framer Motion reveal variants + stagger helper
config/              Typed environment config (env.ts, Phase 6)
constants/           routes.ts (ROUTES — always route through this) + nav.ts (sidebar/landing nav data)
contexts/            App-wide React Context providers (Auth, Theme, Toast, Notifications, Watchlist, Copilot)
data/                Typed static content arrays for the landing page (pricing, testimonials, faq, nav, …)
features/            Domain-specific composed UI, one subfolder per feature (see note below)
hooks/               Reusable hooks (useAsync, useInterval, useOnlineStatus, useMarketData, …)
layouts/             Route-tree shells: AuthLayout, DashboardLayout, PrintLayout, MarketingLayout
pages/               Route components — see the breakdown below
sections/            One component per landing-page section (17 files) — frozen, pixel-parity
services/            Mock data + logic layer — no real backend (see docs/SERVICES.md)
store/               Thin per-domain hooks, almost all wrapping hooks/useAsync.ts around a service call
styles/               globals.css (design tokens + Tailwind @theme), animations.css (keyframes)
types/               Barrel at types/index.ts re-exporting ~27 per-domain files
utils/               Pure helper modules (helpers.ts, finance.ts, statistics.ts, allocation.ts, marketStatus.ts, …)
```

## `pages/` breakdown

```
pages/LandingPage.tsx              The frozen marketing site
pages/AboutPage.tsx                Public, MarketingLayout            (Phase 6)
pages/ContactPage.tsx              Public, MarketingLayout            (Phase 6)
pages/FaqPage.tsx                  Public, MarketingLayout            (Phase 6)
pages/HealthCheckPage.tsx          Public, MarketingLayout            (Phase 6)
pages/NotFoundPage.tsx             Public, MarketingLayout, router's `*` catch-all   (Phase 6)
pages/auth/*.tsx                   5 files — Login/Register/ForgotPassword/VerifyOtp/ResetPassword
pages/dashboard/*.tsx              30 files — one per dashboard route (Phases 1-6's features + the original core pages)
pages/dashboard/reports/*.tsx      2 files — PrintableReportPage/PrintableSnapshotPage (Phase 6, PrintLayout)
```

## `features/` note

Not every subfolder under `features/` is in active use — a handful (`ai-insights`, `analytics`, `dashboard`, `help`, `holdings`, `markets`, `notifications`, `orders`, `portfolio`, `profile`, `settings`, `watchlist`) are empty, leftover from early scaffolding where that page ended up implementing everything directly in its `pages/dashboard/*.tsx` file instead. Harmless, but worth knowing so you don't go looking for code that isn't there. The populated ones (18): `ai-timeline`, `alerts`, `auth`, `copilot`, `daily-brief`, `diversification`, `goal-planner`, `investment-calendar`, `market-explainer`, `onboarding`, `portfolio-doctor`, `rebalancer`, `strategy-builder`, `stress-testing`, `trading`, `wealth-forecast`, `what-if-simulator`, `workspace`.

## Naming conventions

- One component per file, `PascalCase.tsx`, named export (except page components and a few single-purpose files, which default-export).
- Services/hooks/utils are `camelCase.ts`.
- A domain's files share a name stem across layers where possible: `whatIfService.ts` → `useWhatIf.ts` → `WhatIfSimulatorPage.tsx` → `whatIf.ts` (types) — makes it easy to jump between a feature's layers by filename alone.

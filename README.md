# TradeSphere

A production-grade-styled, mock-data FinTech dashboard — an AI-powered investment intelligence platform built on top of a pixel-parity marketing landing page. Six phases of incremental feature work turned a landing-page port into a ~45-route SaaS trading application, without a single rewrite along the way.

**Stack:** React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Framer Motion · React Router v7 · lucide-react

> Everything under `services/` is deterministic mock data — there is no real backend. See [Mock data, not a real backend](#mock-data-not-a-real-backend) below.

## What's here

- **`/`** — the original marketing landing page (frozen, pixel-parity — see [CLAUDE.md](./CLAUDE.md)).
- **`/login`, `/register`, …** — auth flow (accepts any syntactically valid email + a 6+ character password).
- **`/dashboard/*`** — ~35 authenticated routes: portfolio, trading, markets, and a large suite of AI-branded features (see below).
- **`/about`, `/contact`, `/faq`, `/health`** — public utility pages.

## Features, by phase

| Phase | Features |
|---|---|
| Core | Portfolio, Markets, Trading, Watchlist, Orders, Holdings, Analytics |
| 1 | AI Portfolio Doctor, AI Daily Brief, AI Market Explainer, AI Copilot |
| 2 | What-If Simulator, AI Timeline, AI Goal Planner, Future Wealth Forecast |
| 3 | Portfolio Health Dashboard, AI Portfolio Rebalancer, AI Investment Calendar, AI Strategy Builder |
| 4 | Portfolio Risk Analytics, Diversification & Correlation, Performance Attribution, Scenario & Stress Testing |
| 5 | Live Market Center, AI News Intelligence, Watchlists & Smart Alerts, User Workspace |
| 6 | Product polish (onboarding, About/Contact/FAQ, empty states), printable reports, performance work, reliability (error boundaries, offline detection, 404), deployment readiness, this documentation set |

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

See [`docs/INSTALLATION.md`](./docs/INSTALLATION.md) for prerequisites and troubleshooting.

## Scripts

```bash
npm run dev             # dev server
npm run build           # type-check + production build → dist/
npm run build:analyze   # production build + bundle treemap → dist/stats.html
npm run preview         # serve the production build locally
npm run lint            # ESLint
npm run format           # Prettier — write
npm run format:check     # Prettier — check only
```

There is no test runner configured. Verification is `tsc --noEmit` + `eslint .` + `npm run build` + manual/Playwright browser checks — see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Documentation

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — layering, routing, contexts, design tokens.
- [`docs/FOLDER_STRUCTURE.md`](./docs/FOLDER_STRUCTURE.md) — folder-by-folder guide.
- [`docs/COMPONENTS.md`](./docs/COMPONENTS.md) — the shared component library.
- [`docs/SERVICES.md`](./docs/SERVICES.md) — every mock service and what it provides.
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — building and deploying a static build.
- [`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md) — bundle analysis, memoization, and what was (and wasn't) worth optimizing.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — code style, verification checklist, PR expectations.
- [`CHANGELOG.md`](./CHANGELOG.md) — what shipped in each phase.
- [`CLAUDE.md`](./CLAUDE.md) — the project's own contributor rules for AI coding agents (design-token gotchas, ESLint sharp edges, the "landing page is frozen" rule) — worth reading even for human contributors, it's the most detailed convention reference in the repo.

## Mock data, not a real backend

Every module under `services/` is deterministic, seeded mock data/logic (`services/mockUtils.ts`'s `seededRandom` keeps numbers stable across reloads) — there is no server, no database, no real market feed. `authService.ts` accepts any syntactically valid email + a 6+ character password and persists a mock session to `localStorage`; orders, watchlists, alerts, saved reports, and portfolio snapshots all persist the same way. This is a deliberate, transparent design choice (see `docs/SERVICES.md`) — features that would need a real backend to be fully real (CSV import, portfolio sharing) are honestly scoped as previews/client-side-only rather than faked.

## License

Not currently licensed for reuse — portfolio/demonstration project.


   

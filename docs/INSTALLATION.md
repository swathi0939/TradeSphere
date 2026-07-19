# Installation

## Prerequisites

- **Node.js** — 20.19+ or 22.13+ recommended (some transitive dev dependencies, e.g. `eslint-visitor-keys`, warn below this). No `engines` field is currently pinned in `package.json`.
- **npm** (comes with Node). No other package manager has been tested against this repo's lockfile.

## Install

```bash
git clone <repo-url>
cd react-app
npm install
```

## Run

```bash
npm run dev
```

Opens on `http://localhost:5173` by default (Vite's default port — if it's taken, Vite will pick the next free one and print it).

## Environment variables (optional)

Nothing is required to run the app — every variable has a safe default. To override any, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

See `docs/DEPLOYMENT.md`'s environment-variables table for what each does.

## Verify your setup

```bash
npx tsc --noEmit   # type-check
npm run lint       # ESLint
npm run build      # production build
```

All three should complete with no errors (there are 6 known, pre-existing `react-refresh/only-export-components` warnings in `src/contexts/*.tsx` — these are warnings, not errors, and don't affect the app; see `CONTRIBUTING.md`).

## Troubleshooting

- **Port 5173 already in use** — either free it (`lsof -ti:5173 | xargs kill` on macOS/Linux) or let Vite pick another port automatically; it will print whichever it chose.
- **`EBADENGINE` warning on install** — a transitive dev dependency wants a newer Node than you have. It's a warning, not a failure; upgrading Node clears it, but the app runs fine either way.
- **Blank page / stuck on the loading splash** — check the browser console first (this app has a top-level `ErrorBoundary`, so most render errors should surface a friendly fallback screen rather than a blank page — if you see a truly blank page, it's likely a build/dev-server issue, not an app-level render error).
- **Login doesn't work** — `authService.ts` accepts *any* syntactically valid email and any password of 6+ characters. If it's still rejecting you, check the browser console for a validation message.

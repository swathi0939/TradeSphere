# Deployment

TradeSphere is a fully client-side, mock-data application — there is no backend to provision. Deployment is: build a static `dist/` folder and serve it from any static host.

## Build

```bash
npm ci
npm run build   # tsc -b && vite build → outputs to dist/
```

`dist/` is a plain static site: `index.html` + hashed JS/CSS assets. Any static file server works.

## Environment variables

Copy `.env.example` to `.env.local` (already gitignored) if you want to override any default — every variable is optional, all have safe defaults in `src/config/env.ts`:

| Variable | Default | Purpose |
|---|---|---|
| `VITE_APP_NAME` | `TradeSphere` | Shown on the [Health Check](#health-check) page. |
| `VITE_APP_VERSION` | `0.0.0` | Should mirror `package.json`'s `version`. Shown on the Health Check page. |
| `VITE_MOCK_DELAY_MULTIPLIER` | `1` | Scales every mock service's simulated latency — `0` for instant demo responses, `>1` to simulate a slow network. |

## Deploying to a static host

Any of the following work identically, since the output is a plain static SPA build:

- **Vercel / Netlify**: connect the repo, set build command `npm run build`, output directory `dist`. Both auto-detect Vite projects.
- **GitHub Pages**: build, then push `dist/` to a `gh-pages` branch (or use `actions/deploy-pages` in a workflow).
- **Any static file server** (nginx, Caddy, S3+CloudFront, etc.): serve the contents of `dist/`.

### SPA routing note

This app uses `react-router-dom`'s `createBrowserRouter` (client-side history routing), so the host must be configured to serve `index.html` for any unknown path (a "SPA fallback" / rewrite rule) rather than returning a host-level 404 — otherwise a hard refresh on, say, `/dashboard/markets` will 404 at the host level before the app's own `NotFoundPage` (`src/pages/NotFoundPage.tsx`, wired as the router's `*` catch-all) ever gets a chance to render. Vercel/Netlify do this automatically for Vite projects; other hosts typically need a one-line rewrite rule (e.g. nginx's `try_files $uri /index.html;`).

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: install → type-check (`tsc --noEmit`) → lint (`eslint .`) → build. This mirrors the exact verification bar documented in `CLAUDE.md`. Note: this workspace has no git remote configured, so the workflow is authored and correct but has not been exercised against a live GitHub Actions run.

## Health check

`/health` (`src/pages/HealthCheckPage.tsx`) is a client-side status page — there's no backend to probe (every `services/*.ts` module is deterministic mock data), so it reports on the client environment itself: local storage availability, network connectivity (`navigator.onLine`, live via `useOnlineStatus`), active theme, and the app's version/build time (`src/config/env.ts`).

## Bundle analysis

`npm run build:analyze` produces `dist/stats.html`, a treemap of every emitted chunk. See `docs/PERFORMANCE.md` for the current findings.

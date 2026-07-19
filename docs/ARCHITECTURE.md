# Architecture

## Layering

Every dashboard feature follows the same four-layer chain, added-to consistently across all 6 phases:

```
pages/dashboard/XPage.tsx   (route component — composes UI, owns local UI state)
        ↓ calls
store/useX.ts               (thin hook — usually just wraps useAsync(serviceFn, deps))
        ↓ calls
services/xService.ts        (mock async "backend" — deterministic, delay()-wrapped)
        ↓ typed by
types/x.ts                  (re-exported from the types/index.ts barrel)
```

This is deliberate and consistent: a page never calls a service directly, and a service never imports React. The one generic hook every domain hook is built on is `hooks/useAsync.ts` — it runs a fetcher on mount, tracks `{ data, isLoading, error }`, and returns `refetch`. Because every domain hook is a thin wrapper over it, swapping a mock service for a real API call later means editing the service file only — pages and store hooks don't change.

Some features skip the `store/` layer when they're pure composition of already-existing hooks (e.g. `PortfolioHealthPage.tsx` composes 5 existing hooks directly rather than adding a redundant aggregating hook) — a deliberate case-by-case call, not an inconsistency.

## Routing

`router.tsx` is the single route tree, built with `react-router-dom`'s `createBrowserRouter`. Three groups:

- **Public, bare** — `LandingPage` (eagerly imported — it's the first paint at `/`), plus `AboutPage`/`ContactPage`/`FaqPage`/`HealthCheckPage`/`NotFoundPage` (Phase 6), each internally wrapped in `layouts/MarketingLayout.tsx`.
- **`AuthLayout`** — login/register/password-reset flow, unauthenticated only.
- **`DashboardLayout`** — every `/dashboard/*` route; guards on `useAuth().isAuthenticated`, redirecting to `/login` otherwise. Mounts the sidebar/navbar chrome plus a handful of always-present global widgets: `CopilotFab`/`CopilotDrawer` (Phase 1), `OfflineBanner`/`OnboardingTour` (Phase 6).
- **`PrintLayout`** (Phase 6) — same auth guard as `DashboardLayout`, but renders no chrome at all, for the two printable-report routes (`dashboard/reports/:id/print`, `dashboard/snapshots/:id/print`).

Every route-level component is lazy-loaded via `React.lazy` (see `docs/PERFORMANCE.md` for why this matters), wrapped in a shared `withSuspense()` helper using `FullPageSpinner` as the fallback. `constants/routes.ts`'s `ROUTES` object is the single source of truth for path strings — application code should never hardcode a route path.

Errors are handled at two levels: each of the three layout-wrapping route branches has `errorElement: <RouteErrorBoundary />` (React Router's own mechanism, catching errors thrown during a route's render/lazy-import), and `App.tsx` wraps the entire app in a class-component `ErrorBoundary` as a last-resort catch-all for anything outside the router tree.

## State management

No global state library — three mechanisms, chosen deliberately per scope:

1. **React Context**, for state genuinely shared app-wide or across a subtree with many consumers: `AuthContext`, `ThemeContext`, `ToastContext`, `NotificationsContext`, `WatchlistContext`, `CopilotContext`. Each follows the same shape: a `Provider` component, a `useX()` hook that throws if called outside its provider.
2. **Page-local hooks**, for state only one page needs, following the Context providers' internal shape (fetch-on-mount + mutation methods that reset state from a service call's return value) without the overhead of an actual Context — e.g. `useWatchlistGroups`, `useAlerts`, `useWorkspace` (all Phase 5).
3. **`useAsync`**, for the common "fetch on mount, track loading/error" case every domain store hook builds on.

## Design tokens

All theme-able values are CSS custom properties in `styles/globals.css`, re-exported as Tailwind utilities via a `@theme` block. Light/dark mode is one `data-theme` attribute flip on `<html>` (via `useTheme`) — components never special-case theme with `dark:`-style conditionals, they just use a token utility (`bg-surface`, `text-text`, `border-border`) and it flips automatically.

The one sharp edge worth knowing: `--primary` (`#00c896`) and `--accent` (`#3b82f6`) are vivid brand hues that fail WCAG AA as small text directly on a light surface. `text-primary-text`/`text-accent-text`/`text-danger-text` are the contrast-safe variants — the same vivid hue in dark mode, a darker accessible variant in light mode. See `CLAUDE.md` for the full list of these gotchas (there are a few more, around CSS variable inheritance and Tailwind utility-conflict resolution order).

## Landing page is frozen

`pages/LandingPage.tsx` and everything under `sections/*` are the original premium marketing site, migrated from static HTML with pixel-parity as a hard requirement. No phase of dashboard work has redesigned, restructured, or restyled it. Phase 6's public utility pages (About/Contact/FAQ/Health/404) deliberately do **not** reuse `sections/Navbar.tsx`/`sections/Footer.tsx` for this reason — those two components hardcode same-page anchor hrefs (`#footer`, `#top`) tailored to being mounted only at `/`, and reusing them verbatim on a different route would silently produce broken links. The new pages instead use `layouts/MarketingLayout.tsx`, composed from the same lower-level primitives (`LogoMark`, `ThemeToggle`, `Button`, `Container`) those two components themselves use.

## Mock backend

See `docs/SERVICES.md` for the full catalog. The short version: `services/mockUtils.ts` provides a seeded PRNG (`seededRandom`, mulberry32) so demo data is stable across reloads, plus shared helpers (`delay`, `formatCurrency`, `generateId`, …) every service builds on. A handful of services persist real mutable state to `localStorage` (orders, watchlists, notifications-read-state, alerts, saved reports/snapshots) rather than recomputing from scratch every call — everything else is a pure function of its seed.

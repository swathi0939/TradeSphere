# TradeSphere — SaaS Trading Platform

React 19 + TypeScript (strict) + Vite + Tailwind CSS v4 + Framer Motion. A marketing
landing page (`/`) plus a mock-data enterprise SaaS dashboard (auth + `/dashboard/*`)
for a stock trading product, extended over 6 phases into a ~45-route AI-investment
platform (see `CHANGELOG.md` for what shipped in each phase). Human-facing docs live
under `docs/` and in the root `README.md`/`CONTRIBUTING.md` — this file is the
convention reference for anyone (agent or human) making changes.

## Commands

- `npm run dev` — dev server (Vite, default port 5173)
- `npm run build` — `tsc -b && vite build` (type-check must pass before bundling)
- `npm run build:analyze` — production build + bundle treemap at `dist/stats.html`
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run format` / `format:check` — Prettier
- `npm run preview` — serve the production build

There is no test runner configured. Verification is: `tsc --noEmit`, `eslint .`,
`npm run build`, and manual/Playwright browser checks. `.github/workflows/ci.yml` runs
the first three on push/PR (authored, but unexercised — this workspace has no git
remote).

## Structure

Feature-based, not type-based-only:

- `pages/` — route components: `pages/LandingPage.tsx` (frozen, see below),
  `pages/AboutPage.tsx`/`ContactPage.tsx`/`FaqPage.tsx`/`HealthCheckPage.tsx`/
  `NotFoundPage.tsx` (public utility pages), `pages/auth/*`, `pages/dashboard/*`
  (~30 files, one per dashboard route), `pages/dashboard/reports/*` (printable views)
- `layouts/` — route-tree shells, each pairing an auth guard (or none) with chrome:
  `AuthLayout` (no guard, auth-flow card shell), `DashboardLayout` (guards on
  `useAuth().isAuthenticated`; sidebar/navbar chrome via `DashboardSidebar`/
  `DashboardNavbar`, plus always-mounted global widgets — Copilot FAB/drawer,
  `OfflineBanner`, `OnboardingTour`), `PrintLayout` (same guard as `DashboardLayout`,
  zero chrome — for the printable-report routes), `MarketingLayout` (no guard, a
  small header/footer — for the public utility pages above)
- `components/` — shared UI primitives (`components/ui/*`: Button, Input, Card, Table,
  Modal, Drawer, Badge, Accordion, StatCard, EmptyState, AsyncError, etc.), a few
  top-level ones (`Card`, `Button`, `Badge`, `ErrorBoundary`, `OfflineBanner`), and
  `components/charts/*` (canvas/SVG chart primitives, no external charting library).
  See `docs/COMPONENTS.md` for the full catalog.
- `sections/` — one component per landing-page section (17 files), used solely by
  `LandingPage` — **top-level, not nested under `components/`**
- `features/` — domain-specific composed UI, one subfolder per feature (e.g.
  `features/portfolio-doctor/HealthScoreGauge.tsx`). Several subfolders are empty
  leftover scaffolding (a page ended up implementing everything directly in its
  `pages/dashboard/*.tsx` instead) — see `docs/FOLDER_STRUCTURE.md` for which.
- `hooks/` — small, generic, reusable hooks with no domain knowledge: `useAsync`
  (the fetch-on-mount primitive nearly every `store/` hook wraps), `useInterval`,
  `useOnlineStatus`, `useAnimation`, `useIntersection`, `useScroll`, `useTheme`.
  Domain-specific data hooks (`useMarketData`, `usePortfolio`, `useOrders`, …) live in
  `store/`, not here.
- `store/` — thin per-domain hooks, almost all just `useAsync(serviceFn, deps)` —
  the glue between a page and its service. One file per feature area.
- `services/` — mock data + logic layer (see below), no real backend
- `contexts/` — app-wide React Context providers: `AuthContext`, `ThemeContext`,
  `ToastContext`, `NotificationsContext`, `WatchlistContext`, `CopilotContext`
- `config/` — typed environment config (`env.ts`, backed by `vite-env.d.ts`) — the
  one place `import.meta.env` should be read from, so a later swap to real
  environment-driven config touches one file, not every call site
- `constants/` — `routes.ts` (`ROUTES` object — always route through this, never hardcode
  a path string; also home to the app's dynamic-route path builders, e.g.
  `buildReportPrintPath(id)`), `nav.ts` (sidebar nav config)
- `types/` — barrel at `types/index.ts` re-exporting ~27 per-domain files
- `router.tsx` — route tree, all page-level components are lazy-loaded via
  `React.lazy` + `Suspense` for route-based code splitting (already comprehensive —
  see `docs/PERFORMANCE.md` before assuming more splitting is needed). Each
  layout-wrapping branch has `errorElement: <RouteErrorBoundary />`; `App.tsx` wraps
  the whole tree in a class-component `ErrorBoundary` as a last-resort catch-all.
- `styles/globals.css` — design tokens (CSS custom properties) + Tailwind `@theme` block
- `docs/` — human-facing documentation (architecture, folder structure, component/
  service catalogs, deployment, performance) — read these for context before a large
  change; this file stays the terse convention/gotcha reference

## Design system — do not introduce new colors/tokens ad hoc

All theme-able values are CSS custom properties in `styles/globals.css`, re-exported as
Tailwind utilities via a `@theme` block. Light/dark mode works by overriding the
`:root` custom properties under `:root[data-theme='light']` — components should never
special-case theme with `dark:`-style conditionals; just use the token utility
(`bg-surface`, `text-text`, `border-border`, etc.) and it flips automatically.

**Contrast-safe text tokens**: `--primary` (`#00c896`) and `--accent` (`#3b82f6`) are
vivid brand hues that fail WCAG AA (4.5:1) as small text directly on white/light
surfaces. Never use `text-primary` / `text-accent` for actual text sitting on a plain or
lightly-tinted background (e.g. `bg-[rgba(var(--primary-rgb),0.1)]`) — use
`text-primary-text` / `text-accent-text` / `text-danger-text` instead. These resolve to
the same vivid hue in dark mode and a darker, accessible variant in light mode. This
rule does **not** apply to icon-only elements (`aria-hidden` SVGs with no text) — axe's
color-contrast check only evaluates text nodes.

**CSS variable inheritance gotcha**: `--color-text: var(--text)` (Tailwind's `@theme`
pattern) is resolved once, where it's declared, and that resolved value is what
descendants inherit — re-declaring `--text` further down the tree does **not**
propagate to `--color-text` for those descendants. If you need to override themed text
color for a subtree (e.g. `AuthLayout`'s dark card), override the actual consumed
variable (`--color-text`) directly, not the upstream token. And if a child element (like
`Input`) needs to escape that override and pair with its own background instead, read
the root token directly via an arbitrary value (`text-[var(--text)]`), bypassing the
Tailwind-generated intermediate.

**Tailwind utility conflicts**: when two utility classes target the same CSS property
conditionally (e.g. an active/inactive ternary), Tailwind v4's generation order decides
the winner, not className string order. Always use one exclusive ternary per property,
never layer two conditional utilities for the same property.

## React 19 / eslint-plugin-react-hooks v7 (Compiler-aware rules)

This repo's ESLint config enables strict compiler-aware hook rules. Known sharp edges:

- `react-hooks/refs` — never mutate a ref during render; move `ref.current = x`
  assignments into a `useEffect`.
- `react-hooks/use-memo` — `useMemo`/`useCallback` dependency arrays must be literal
  arrays. A generic hook that takes a caller-supplied `deps: unknown[]` (see
  `hooks/useAsync.ts`) fundamentally can't satisfy this — scope a justified
  `eslint-disable`/`eslint-enable` block around just that call rather than disabling the
  rule file-wide.
- `react-hooks/set-state-in-effect` — flags `setState` inside effects, including
  legitimate fetch-on-mount. Put `eslint-disable-next-line` directly above the
  offending statement (not the outer `useEffect(() => {` line — the rule anchors to the
  actual violating line).
- `react-hooks/immutability` — no reassigning an outer variable inside a render-time
  `.map()` callback (e.g. a running accumulator). Precompute an array of intermediate
  values instead (see `components/charts/DonutChart.tsx`'s `precedingPercents`).

## Services layer (mock backend)

Everything under `services/` is deterministic mock data / logic — there is no real
backend; see `docs/SERVICES.md` for the full per-file catalog. `services/mockUtils.ts`
provides a seeded PRNG (`seededRandom`) so data is stable across reloads, plus every
service's shared helpers (`delay`, `formatCurrency`, `generateId`, …). `authService.ts`
accepts any syntactically valid email + password ≥ 6 characters (see `login()`) and
persists a mock session to `localStorage`. Several services persist real mutable state
to `localStorage` rather than recomputing from a seed every call — orders
(`ordersService.ts`'s module-level `ORDER_STORE`), the original single default
watchlist (`watchlistService.ts`), notification read-state, named watchlist groups
(`watchlistGroupsService.ts` — a deliberately *separate* system from
`watchlistService.ts`, own storage key, see `docs/SERVICES.md`), price/portfolio
alerts, saved reports/snapshots, and the onboarding-seen flag.

`mockUtils.ts`'s `delay(value, ms)` scales `ms` by `config/env.ts`'s
`MOCK_DELAY_MULTIPLIER` (`VITE_MOCK_DELAY_MULTIPLIER`) — set it to `0` for instant
responses in a demo, or leave it alone (default `1`, unchanged behavior). This is the
one thing in the mock layer that reads environment config; don't add ad hoc
`import.meta.env` reads elsewhere — go through `config/env.ts`.

## Landing page is frozen

`pages/LandingPage.tsx` and everything under `sections/` (top-level, **not** nested
under `components/`) are the original premium marketing site — pixel-parity was a hard
requirement when this was migrated from static HTML to React. Do not redesign,
restructure, or restyle it as a side effect of dashboard/SaaS work. The dashboard app
is an *extension* alongside it, not a replacement.

**Don't reuse `sections/Navbar.tsx`/`sections/Footer.tsx` on a new route.** Both
hardcode same-page anchor hrefs (`#footer`, `#top`, `#hero`, …) tailored to being
mounted only at `/` — dropping either onto a different route silently breaks every one
of its links (they'll try to scroll to an anchor that doesn't exist on that page
instead of navigating anywhere). Public pages that aren't part of the landing page
(About/Contact/FAQ/Health/404) use `layouts/MarketingLayout.tsx` instead — composed
from the same lower-level primitives those two components themselves use (`LogoMark`,
`ThemeToggle`, `Button`, `Container`), with real `ROUTES` links. `sections/FAQ.tsx` is
the one exception worth knowing about: it has no cross-page anchor coupling and is
reused verbatim by `pages/FaqPage.tsx`.

## Verification checklist for new work

After any page/component change: `npx tsc --noEmit`, `npm run lint`, `npm run build`,
and a manual check (or Playwright) for console errors, WCAG AA color-contrast (axe-core
`wcag2aa` tag, `color-contrast` rule) in both themes, and responsive behavior at mobile/
tablet/desktop breakpoints. For anything touching `useAsync`-backed data fetching,
check whether the page should surface `error`/`refetch` via `components/ui/AsyncError`
(most pages still don't — it's wired into 3 flagship pages as a demonstrated pattern,
not mechanically applied everywhere; see `docs/ARCHITECTURE.md`'s "Routing" section for
the error-handling layers). For anything bundle-size-sensitive, `npm run build:analyze`
before assuming a change needs its own manual chunk — `docs/PERFORMANCE.md` documents
what was and wasn't worth splitting.

# Performance

Findings and changes from the Phase 6 performance pass, with real measured numbers rather than assumptions.

## Bundle analysis

Run `npm run build:analyze` (`tsc -b && vite build --mode analyze`) to produce `dist/stats.html`, a treemap of every emitted chunk (via `rollup-plugin-visualizer`, gated behind Vite's `analyze` mode so a normal `npm run build` is unaffected — see `vite.config.ts`).

**Before this pass:** a single ~516 kB main chunk (Vite's own build output already flagged this: *"Some chunks are larger than 500 kB after minification"*).

**After:** splitting `framer-motion` into its own chunk via `build.rollupOptions.output.manualChunks`:

| Chunk | Size | Gzipped |
|---|---|---|
| `index-*.js` (main) | 390.88 kB | 123.33 kB |
| `vendor-motion-*.js` | 133.49 kB | 43.66 kB |

A real ~126 kB reduction in the main entry chunk. `framer-motion` is used by ~20 components across the app (landing page reveal animations, dashboard route transitions, modals/drawers), but most dashboard pages don't need its full API on first paint — splitting it lets the browser cache it independently and lets pages that render before it's needed start executing sooner.

**Why not also split `react`/`react-dom`/`react-router-dom`?** Tried it — Rollup folded the forced split straight back into the main chunk with zero size change. These are needed synchronously by the entry point regardless of how they're grouped, so forcing a separate chunk just adds a network round-trip with no benefit. Not worth carrying the dead configuration, so it was removed after confirming this.

## Route-level code-splitting

Already comprehensive before this phase — confirmed, not reworked. All 34 non-landing routes in `router.tsx` use `React.lazy(() => import(...))`; only `LandingPage` is eagerly imported, correctly, since it's the first paint at `/`. The production build emits 84 separate JS chunks, one per lazy-loaded route/component plus shared vendor/utility chunks — each dashboard page ships only the code it needs.

## Memoization

This codebase had zero `React.memo` usage prior to this pass — there is no React Compiler configured (confirmed: no `babel-plugin-react-compiler`, no compiler option in `vite.config.ts`'s `@vitejs/plugin-react` setup), so memoization is genuinely manual here, not redundant with an automatic compiler pass. Added `React.memo` to three list-row components that render in multi-item lists and re-render on parent state changes unrelated to their own data:

- `components/ui/MarketCard.tsx` — rendered in grids of up to ~30 on `MarketsPage`/`DashboardOverviewPage`; previously re-rendered on every keystroke in the search box even for cards whose own stock data hadn't changed.
- `components/ui/NotificationCard.tsx` — rendered in lists on `NotificationsPage` and the navbar's notification dropdown; re-rendered on tab switches / mark-all-read even for unaffected rows.
- `features/ai-timeline/TimelineItem.tsx` — rendered dozens-deep in `AITimelinePage`'s feed; re-rendered on day-range switches even for rows whose event data is unchanged.

## Image optimization

Grepped the whole app: exactly one `<img>` element exists (`components/ui/Avatar.tsx`, the user's optional custom avatar photo — everything else is inline SVG via `lucide-react` or the app's own canvas/SVG chart components). Added `loading="lazy"` + `decoding="async"` to it. There is no raster-image debt elsewhere to address.

## Render optimization

Covered by the memoization work above — the three components chosen were selected specifically because they sit in re-render-heavy list contexts, not memoized speculatively across the app.

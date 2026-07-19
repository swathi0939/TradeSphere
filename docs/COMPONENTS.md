# Component Library

## Top-level (`components/*.tsx`)

| Component | Purpose |
|---|---|
| `Button` | Every CTA in the app. Renders `<button>` or `<a>` depending on whether `href` is passed. `variant`: `primary`/`ghost`/`text`. `size`: `default`/`sm`/`lg`. `onDark` for ghost buttons over always-dark surfaces. |
| `Card` | Base surface reused by nearly everything. `glass` (glassmorphism), `spotlight` (cursor-follow glow), `as` (polymorphic tag). |
| `Badge` | Small pill label. `variant`: `solid`/`outline-primary`/`outline-accent`, `active` toggles the inactive/grey state. |
| `Container` | Max-width content wrapper (`max-w-[1200px]`), matches the original static site's `.container`. |
| `SectionTitle` | Eyebrow + heading + optional subtitle, scroll-reveal animated, used atop every landing-page section and reused by `AboutPage`/`FaqPage`. |
| `LogoMark` | The diamond brand mark SVG. |
| `Loader` | Honeycomb loading splash shown until the landing page settles. |
| `BackToTop` | Floating scroll-to-top button. |
| `ThemeToggle` | Sun/moon dark-light toggle button, drives `ThemeContext`. |
| `ErrorBoundary` / `RouteErrorBoundary` | Phase 6. A class component (the only one in the app — required for `componentDidCatch`) plus a function component reading React Router's `useRouteError()`; both render the same friendly fallback. |
| `OfflineBanner` | Phase 6. Renders `null` while online; a slim `bg-danger` bar while `useOnlineStatus()` reports offline. |

## `components/ui/*` — the shared primitive library (25 components)

| Component | Purpose |
|---|---|
| `Accordion` | Generic single-open accordion (Help Center FAQ). |
| `AllocationBar` | Labeled current-vs-target allocation bar (Portfolio Health, Rebalancer). |
| `AsyncError` | Phase 6. Retry panel for a failed `useAsync` fetch — `{ message, onRetry }`. |
| `Avatar` | Circular avatar, image or initials-on-gradient fallback. `size`: `sm`/`md`/`lg`. |
| `ChartWrapper` | Consistent card frame for chart sections — title/subtitle + action slot. Used on almost every dashboard page. |
| `Checkbox` | Custom-styled checkbox with a label. |
| `Drawer` | Slide-in side panel (`side`: `left`/`right`). |
| `Dropdown` / `DropdownItem` | Click-outside-to-close menu, render-prop trigger. Used for the avatar menu, notification bell, and several report/sector pickers. |
| `EmptyState` | Phase 6. Icon + title + description + optional action — the "nothing here yet" block, replacing several pages' one-off empty-state markup. |
| `Input` | Text input with label/error/hint, optional leading icon, password-reveal toggle. |
| `MarketCard` | Stock card — price, change, sparkline, watchlist star, AI move-explainer trigger. Memoized (Phase 6) — rendered in grids of dozens. |
| `Modal` | Centered dialog, portal-rendered, Escape-to-close, body-scroll-lock. |
| `NotificationCard` | One notification row. Memoized (Phase 6). |
| `PageHeader` | Title/subtitle/actions row atop every dashboard page. |
| `Pagination` | Numbered pager with prev/next. |
| `PortfolioCard` | Compact holding summary card. |
| `SearchBar` | Icon-prefixed search input with a clear button. |
| `SegmentedControl` | Accessible roving-tabIndex toggle (`role="radiogroup"`) — the Conservative/Moderate/Aggressive scenario picker reused across Phases 2-4. |
| `Skeleton` / `SkeletonText` / `SkeletonCard` | Loading placeholders, used on every async-data page. |
| `Slider` | Labeled `<input type="range">` matching `Input`'s conventions — free keyboard support, themed via `accentColor`. |
| `Spinner` / `FullPageSpinner` | Small inline spinner; `FullPageSpinner` is every lazy route's `Suspense` fallback (fade-in polished in Phase 6). |
| `StatCard` | KPI card — value, up/down change badge, icon. Used on nearly every dashboard page. |
| `Table` | Generic, responsive, horizontally-scrollable data table — typed `TableColumn<T>[]`. |
| `Toast` / `ToastViewport` | Toast stack, rendered once near the app root, driven by `ToastContext`. |
| `Tooltip` | Pure-CSS group-hover tooltip, no positioning library. |

## `components/charts/*`

Canvas/SVG chart primitives with no external charting library: `HeroCandlestickChart`, `IndicatorChart`, `TickerField` (landing page only), `TradingChart`, `LineAreaChart`, `BarChart`, `DonutChart`, `MiniSparkline`. All read colors live from computed CSS custom properties, so they redraw correctly on a theme change without prop-drilling theme state.

## Layouts (`layouts/*.tsx`)

| Layout | Guards on auth? | Chrome |
|---|---|---|
| `AuthLayout` | No | Auth-flow card shell |
| `DashboardLayout` | Yes | Sidebar + navbar + Copilot/Offline/Onboarding widgets |
| `PrintLayout` | Yes | None — bare, forces a white/black print appearance |
| `MarketingLayout` | No | Small header (logo/theme-toggle/login-signup) + footer, for public utility pages |

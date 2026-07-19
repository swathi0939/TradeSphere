# Services

Every file here is deterministic mock data/logic — there is no real backend. Most functions are `async` and wrapped in `mockUtils.ts`'s `delay()` to simulate real network latency (scaled by `VITE_MOCK_DELAY_MULTIPLIER`, see `docs/DEPLOYMENT.md`), even though the underlying computation is synchronous. All are re-exported from the `services/index.ts` barrel.

## Foundation

| Service | Provides |
|---|---|
| `mockUtils.ts` | `delay`, `seededRandom` (mulberry32 PRNG), `hashString`, `randomBetween`/`randomInt`, `pick`, `generateSparkline`, `formatCurrency`/`formatCompactNumber`, `generateId`, `daysAgoISO`. Every other service builds on this one. |
| `stockUniverse.ts` | `STOCK_UNIVERSE` — the ~30-symbol seeded universe (NSE + a few NASDAQ names) every market-data feature reads from. |
| `authService.ts` | `login`/`register`/`logout`/`getSession` — accepts any syntactically valid email + 6+ character password, persists a mock session to `localStorage`. |

## Core trading/portfolio

| Service | Provides |
|---|---|
| `stocksService.ts` | `getStocks`, `getStockBySymbol`, `searchStocks`, `getTopGainers`/`getTopLosers`, `getMarketIndices`, crypto/forex/commodity asset getters, `getAllSectors`, `subscribeToLiveTicks` (Phase 5's live-tick simulation). |
| `portfolioService.ts` | `getHoldings`, `getPortfolioSummary`, `getSectorAllocation`, `getPerformanceHistory`, `getOpenPositions` — the numbers nearly every AI feature across all 6 phases ultimately derives from. |
| `ordersService.ts` | `getOrders`, `placeOrder`, `cancelOrder` — persists to a module-level store + `localStorage`. |
| `transactionsService.ts` | `getTransactions` — deposit/withdrawal/buy/sell/dividend history. |
| `watchlistService.ts` | The original single default watchlist — `getWatchlist`/`addToWatchlist`/`removeFromWatchlist`/`isInWatchlist`, `localStorage`-backed. |
| `notificationsService.ts` | `getNotifications`, `markAsRead`/`markAllAsRead`. |
| `newsService.ts` | `getNews` — headlines with sentiment + related symbols. |

## Phase 1 — AI Portfolio Doctor, Daily Brief, Market Explainer, Copilot

| Service | Provides |
|---|---|
| `aiService.ts` | `getAIInsights`, `getMarketSentiment`, `getPortfolioHealth`, `getPricePredictions`, `getRiskMetrics`, `getMonthlyReturns`. |
| `portfolioDoctorService.ts` | `getPortfolioDiagnosis` — a **real** HHI-based diversification score + concentration warnings computed from actual holdings, not a random stub. Reused directly by Phase 4's Diversification service and Phase 6's saved-reports feature. |
| `dailyBriefService.ts` | `getDailyBrief` — composes `portfolioService`/`aiService`/`newsService` into one narrative. |
| `marketExplainerService.ts` | `explainMove` — a rule-based (not LLM-based) explanation for why a stock moved, grounded in its own change% vs. its sector's average. |
| `copilotService.ts` | Pattern-matching chat responses (stock lookups, portfolio/market questions), no real LLM. |

## Phase 2 — What-If, Timeline, Goal Planner, Wealth Forecast

`whatIfService.ts`, `aiTimelineService.ts` (merges insights/trades/news/performance swings into one feed), `goalPlannerService.ts`, `wealthForecastService.ts`. All build on `utils/finance.ts`'s compound-growth math.

## Phase 3 — Portfolio Health, Rebalancer, Investment Calendar, Strategy Builder

`rebalancerService.ts` (builds on `utils/allocation.ts`), `investmentCalendarService.ts`, `strategyBuilderService.ts` (scores `STOCK_UNIVERSE` against 5 templates using each stock's real fields — every rationale string is derived from the same numbers used to score it, not picked from a random list). Portfolio Health has no dedicated service — it composes 5 existing hooks directly.

## Phase 4 — Risk Analytics, Diversification, Performance Attribution, Stress Testing

`riskAnalyticsService.ts` (builds on `utils/statistics.ts`), `diversificationService.ts` (reuses `portfolioDoctorService.getPortfolioDiagnosis()` rather than recomputing the same HHI math), `performanceAttributionService.ts`, `stressTestingService.ts`.

## Phase 5 — Live Market Center, News Intelligence, Alerts, Workspace

`newsIntelligenceService.ts` (sentiment breakdown + trending topics, built entirely on the existing `newsService.getNews()`), `watchlistGroupsService.ts` (named, multi-list watchlists — a deliberately **separate** system from `watchlistService.ts`'s single default list, own `localStorage` key), `alertsService.ts` (price/portfolio alert CRUD + a pure `evaluateAlerts()` function so both initial load and periodic recheck share one code path), `workspaceService.ts` (portfolio snapshots + saved AI reports, `localStorage`-backed).

## Phase 6 — Onboarding

`onboardingService.ts` — `hasSeenOnboarding`/`markOnboardingSeen`, a plain synchronous `localStorage` flag (no `delay()` — there's no simulated fetch, just a boolean read/write).

## Shared math utilities (`utils/*.ts`, not `services/`, but tightly coupled)

`finance.ts` (compound growth, goal-seeking), `statistics.ts` (returns, stdev, correlation, rolling volatility, drawdown, historical VaR), `allocation.ts` (ideal-allocation heuristic, rebalance actions/score), `marketStatus.ts` (NSE market-hours open/closed, Phase 6).

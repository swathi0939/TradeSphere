export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  faq: '/faq',
  health: '/health',

  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  verifyOtp: '/verify-otp',
  resetPassword: '/reset-password',

  dashboard: '/dashboard',
  overview: '/dashboard',
  portfolio: '/dashboard/portfolio',
  markets: '/dashboard/markets',
  trading: '/dashboard/trading',
  watchlist: '/dashboard/watchlist',
  orders: '/dashboard/orders',
  holdings: '/dashboard/holdings',
  analytics: '/dashboard/analytics',
  aiInsights: '/dashboard/ai-insights',
  portfolioDoctor: '/dashboard/portfolio-doctor',
  whatIfSimulator: '/dashboard/simulator',
  aiTimeline: '/dashboard/ai-timeline',
  goalPlanner: '/dashboard/goal-planner',
  wealthForecast: '/dashboard/wealth-forecast',
  portfolioHealth: '/dashboard/portfolio-health',
  rebalancer: '/dashboard/rebalancer',
  investmentCalendar: '/dashboard/investment-calendar',
  strategyBuilder: '/dashboard/strategy-builder',
  riskAnalytics: '/dashboard/risk-analytics',
  diversification: '/dashboard/diversification',
  performanceAttribution: '/dashboard/performance-attribution',
  stressTesting: '/dashboard/stress-testing',
  newsIntelligence: '/dashboard/news',
  smartAlerts: '/dashboard/alerts',
  workspace: '/dashboard/workspace',
  notifications: '/dashboard/notifications',
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
  helpCenter: '/dashboard/help',
} as const;

export type RouteKey = keyof typeof ROUTES;

export function buildReportPrintPath(id: string): string {
  return `/dashboard/reports/${id}/print`;
}

export function buildSnapshotPrintPath(id: string): string {
  return `/dashboard/snapshots/${id}/print`;
}

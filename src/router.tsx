import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PrintLayout } from '@/layouts/PrintLayout';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { RouteErrorBoundary } from '@/components/ErrorBoundary';
import { ROUTES } from '@/constants/routes';
import LandingPage from '@/pages/LandingPage';

const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const HealthCheckPage = lazy(() => import('@/pages/HealthCheckPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const VerifyOtpPage = lazy(() => import('@/pages/auth/VerifyOtpPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

const DashboardOverviewPage = lazy(() => import('@/pages/dashboard/DashboardOverviewPage'));
const PortfolioPage = lazy(() => import('@/pages/dashboard/PortfolioPage'));
const MarketsPage = lazy(() => import('@/pages/dashboard/MarketsPage'));
const TradingPage = lazy(() => import('@/pages/dashboard/TradingPage'));
const WatchlistPage = lazy(() => import('@/pages/dashboard/WatchlistPage'));
const OrdersPage = lazy(() => import('@/pages/dashboard/OrdersPage'));
const HoldingsPage = lazy(() => import('@/pages/dashboard/HoldingsPage'));
const AnalyticsPage = lazy(() => import('@/pages/dashboard/AnalyticsPage'));
const AIInsightsPage = lazy(() => import('@/pages/dashboard/AIInsightsPage'));
const PortfolioDoctorPage = lazy(() => import('@/pages/dashboard/PortfolioDoctorPage'));
const WhatIfSimulatorPage = lazy(() => import('@/pages/dashboard/WhatIfSimulatorPage'));
const AITimelinePage = lazy(() => import('@/pages/dashboard/AITimelinePage'));
const GoalPlannerPage = lazy(() => import('@/pages/dashboard/GoalPlannerPage'));
const FutureWealthForecastPage = lazy(() => import('@/pages/dashboard/FutureWealthForecastPage'));
const PortfolioHealthPage = lazy(() => import('@/pages/dashboard/PortfolioHealthPage'));
const RebalancerPage = lazy(() => import('@/pages/dashboard/RebalancerPage'));
const InvestmentCalendarPage = lazy(() => import('@/pages/dashboard/InvestmentCalendarPage'));
const StrategyBuilderPage = lazy(() => import('@/pages/dashboard/StrategyBuilderPage'));
const RiskAnalyticsPage = lazy(() => import('@/pages/dashboard/RiskAnalyticsPage'));
const DiversificationPage = lazy(() => import('@/pages/dashboard/DiversificationPage'));
const PerformanceAttributionPage = lazy(() => import('@/pages/dashboard/PerformanceAttributionPage'));
const StressTestingPage = lazy(() => import('@/pages/dashboard/StressTestingPage'));
const NewsIntelligencePage = lazy(() => import('@/pages/dashboard/NewsIntelligencePage'));
const SmartAlertsPage = lazy(() => import('@/pages/dashboard/SmartAlertsPage'));
const WorkspacePage = lazy(() => import('@/pages/dashboard/WorkspacePage'));
const NotificationsPage = lazy(() => import('@/pages/dashboard/NotificationsPage'));
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));
const HelpCenterPage = lazy(() => import('@/pages/dashboard/HelpCenterPage'));

const PrintableReportPage = lazy(() => import('@/pages/dashboard/reports/PrintableReportPage'));
const PrintableSnapshotPage = lazy(() => import('@/pages/dashboard/reports/PrintableSnapshotPage'));

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter([
  { path: ROUTES.home, element: <LandingPage /> },
  { path: ROUTES.about, element: withSuspense(AboutPage) },
  { path: ROUTES.contact, element: withSuspense(ContactPage) },
  { path: ROUTES.faq, element: withSuspense(FaqPage) },
  { path: ROUTES.health, element: withSuspense(HealthCheckPage) },
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: ROUTES.login, element: withSuspense(LoginPage) },
      { path: ROUTES.register, element: withSuspense(RegisterPage) },
      { path: ROUTES.forgotPassword, element: withSuspense(ForgotPasswordPage) },
      { path: ROUTES.verifyOtp, element: withSuspense(VerifyOtpPage) },
      { path: ROUTES.resetPassword, element: withSuspense(ResetPasswordPage) },
    ],
  },
  {
    element: <PrintLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: 'dashboard/reports/:id/print', element: withSuspense(PrintableReportPage) },
      { path: 'dashboard/snapshots/:id/print', element: withSuspense(PrintableSnapshotPage) },
    ],
  },
  {
    path: ROUTES.dashboard,
    element: <DashboardLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: withSuspense(DashboardOverviewPage) },
      { path: 'portfolio', element: withSuspense(PortfolioPage) },
      { path: 'markets', element: withSuspense(MarketsPage) },
      { path: 'trading', element: withSuspense(TradingPage) },
      { path: 'watchlist', element: withSuspense(WatchlistPage) },
      { path: 'orders', element: withSuspense(OrdersPage) },
      { path: 'holdings', element: withSuspense(HoldingsPage) },
      { path: 'analytics', element: withSuspense(AnalyticsPage) },
      { path: 'ai-insights', element: withSuspense(AIInsightsPage) },
      { path: 'portfolio-doctor', element: withSuspense(PortfolioDoctorPage) },
      { path: 'simulator', element: withSuspense(WhatIfSimulatorPage) },
      { path: 'ai-timeline', element: withSuspense(AITimelinePage) },
      { path: 'goal-planner', element: withSuspense(GoalPlannerPage) },
      { path: 'wealth-forecast', element: withSuspense(FutureWealthForecastPage) },
      { path: 'portfolio-health', element: withSuspense(PortfolioHealthPage) },
      { path: 'rebalancer', element: withSuspense(RebalancerPage) },
      { path: 'investment-calendar', element: withSuspense(InvestmentCalendarPage) },
      { path: 'strategy-builder', element: withSuspense(StrategyBuilderPage) },
      { path: 'risk-analytics', element: withSuspense(RiskAnalyticsPage) },
      { path: 'diversification', element: withSuspense(DiversificationPage) },
      { path: 'performance-attribution', element: withSuspense(PerformanceAttributionPage) },
      { path: 'stress-testing', element: withSuspense(StressTestingPage) },
      { path: 'news', element: withSuspense(NewsIntelligencePage) },
      { path: 'alerts', element: withSuspense(SmartAlertsPage) },
      { path: 'workspace', element: withSuspense(WorkspacePage) },
      { path: 'notifications', element: withSuspense(NotificationsPage) },
      { path: 'profile', element: withSuspense(ProfilePage) },
      { path: 'settings', element: withSuspense(SettingsPage) },
      { path: 'help', element: withSuspense(HelpCenterPage) },
    ],
  },
  { path: '*', element: withSuspense(NotFoundPage) },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

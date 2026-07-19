import {
  LayoutDashboard,
  Briefcase,
  ChartLine,
  ChartCandlestick,
  Star,
  ListOrdered,
  Landmark,
  ChartNoAxesColumn,
  Sparkles,
  Stethoscope,
  SlidersHorizontal,
  History,
  Target,
  LineChart,
  HeartPulse,
  Scale,
  CalendarClock,
  Wand2,
  ShieldAlert,
  Network,
  BarChart3,
  CloudLightning,
  Newspaper,
  AlarmClock,
  FolderKanban,
  Bell,
  Settings,
  User,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';
import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  end?: boolean;
}

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.overview, icon: LayoutDashboard, end: true },
  { label: 'Portfolio', href: ROUTES.portfolio, icon: Briefcase },
  { label: 'Markets', href: ROUTES.markets, icon: ChartLine },
  { label: 'Trading', href: ROUTES.trading, icon: ChartCandlestick },
  { label: 'Watchlist', href: ROUTES.watchlist, icon: Star },
  { label: 'Orders', href: ROUTES.orders, icon: ListOrdered },
  { label: 'Holdings', href: ROUTES.holdings, icon: Landmark },
  { label: 'Analytics', href: ROUTES.analytics, icon: ChartNoAxesColumn },
  { label: 'AI Insights', href: ROUTES.aiInsights, icon: Sparkles },
  { label: 'Portfolio Doctor', href: ROUTES.portfolioDoctor, icon: Stethoscope },
  { label: 'What-If Simulator', href: ROUTES.whatIfSimulator, icon: SlidersHorizontal },
  { label: 'AI Timeline', href: ROUTES.aiTimeline, icon: History },
  { label: 'AI Goal Planner', href: ROUTES.goalPlanner, icon: Target },
  { label: 'Wealth Forecast', href: ROUTES.wealthForecast, icon: LineChart },
  { label: 'Portfolio Health', href: ROUTES.portfolioHealth, icon: HeartPulse },
  { label: 'AI Rebalancer', href: ROUTES.rebalancer, icon: Scale },
  { label: 'Investment Calendar', href: ROUTES.investmentCalendar, icon: CalendarClock },
  { label: 'Strategy Builder', href: ROUTES.strategyBuilder, icon: Wand2 },
  { label: 'Risk Analytics', href: ROUTES.riskAnalytics, icon: ShieldAlert },
  { label: 'Diversification', href: ROUTES.diversification, icon: Network },
  { label: 'Performance Attribution', href: ROUTES.performanceAttribution, icon: BarChart3 },
  { label: 'Stress Testing', href: ROUTES.stressTesting, icon: CloudLightning },
  { label: 'AI News', href: ROUTES.newsIntelligence, icon: Newspaper },
  { label: 'Smart Alerts', href: ROUTES.smartAlerts, icon: AlarmClock },
  { label: 'Workspace', href: ROUTES.workspace, icon: FolderKanban },
];

export const SIDEBAR_NAV_SECONDARY: NavItem[] = [
  { label: 'Notifications', href: ROUTES.notifications, icon: Bell },
  { label: 'Settings', href: ROUTES.settings, icon: Settings },
  { label: 'Profile', href: ROUTES.profile, icon: User },
  { label: 'Help Center', href: ROUTES.helpCenter, icon: LifeBuoy },
];

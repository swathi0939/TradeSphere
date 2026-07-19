import { Activity, Briefcase, ChartColumn, FileText, Landmark, ShieldCheck, Star, Target } from 'lucide-react';
import type { FeatureItem } from '@/types';

export const FEATURES: FeatureItem[] = [
  {
    icon: Activity,
    title: 'Real-Time Market Dashboard',
    description: 'Live prices streamed over WebSocket from NSE/BSE. Watch the market move the moment it happens — no refresh needed.',
  },
  {
    icon: Target,
    title: 'Smart Order Types',
    description: 'Place Market, Limit, and Stop-Loss orders. Full control over how and when your trades execute.',
  },
  {
    icon: Briefcase,
    title: 'Portfolio Management',
    description: 'Track holdings, average price, realized/unrealized P&L, and returns % in one clear view.',
  },
  {
    icon: Star,
    title: 'Watchlists',
    description: 'Save your favorite stocks and ETFs. Organize, monitor, and act fast.',
  },
  {
    icon: ChartColumn,
    title: 'Interactive Charts',
    description: 'Candlestick, Line, and OHLC charts with pro indicators — RSI, MACD, and Bollinger Bands built in.',
  },
  {
    icon: Landmark,
    title: 'Secure Fund Management',
    description: 'Deposit and withdraw via UPI, Bank, or card (Razorpay / Stripe). Every transaction is encrypted and logged.',
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Level Security',
    description: 'Spring Security + JWT with 2FA via Google Authenticator / OTP. Your account, locked down.',
  },
  {
    icon: FileText,
    title: 'Transparent History',
    description: 'Complete order and transaction logs. Every action, timestamped and traceable.',
  },
];

import type { PricingTier } from '@/types';

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '₹0',
    period: '/ forever',
    features: [
      'Real-time market dashboard',
      'Up to 3 watchlists',
      'Market & Limit orders',
      'Basic charts (Line, Candlestick)',
      'Portfolio tracking',
      'Email support',
    ],
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/ month',
    features: [
      'Everything in Starter',
      'Unlimited watchlists',
      'Stop-Loss orders',
      'Advanced indicators (RSI, MACD, Bollinger Bands)',
      'OHLC charts',
      'Priority support',
      'Exportable transaction reports',
    ],
    cta: 'Go Pro',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Elite',
    price: '₹1,499',
    period: '/ month',
    features: [
      'Everything in Pro',
      'Advanced analytics & insights',
      'AI-powered stock recommendations (roadmap)',
      'Early access to Options & Futures',
      'Dedicated account manager',
      'API access',
    ],
    cta: 'Contact Sales',
  },
];

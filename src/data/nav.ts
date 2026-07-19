import { CircleCheck, Layers, Shield, Zap } from 'lucide-react';
import type { FooterLinkColumn, NavLink, TrustBullet } from '@/types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Markets', href: '#charts' },
  { label: 'About', href: '/about' },
];

export const TRUST_BULLETS: TrustBullet[] = [
  { icon: Shield, label: 'Bank-level security (Spring Security + JWT, 2FA)' },
  { icon: Zap, label: 'Real-time NSE/BSE market data' },
  { icon: Layers, label: 'Zero hidden charges' },
  { icon: CircleCheck, label: '50,000+ trades executed' },
];

export const TRUSTED_BY_LOGOS = ['NSE', 'BSE', 'UPI', 'Razorpay', 'Stripe', 'Google Authenticator'];

export const FOOTER_SOCIAL_LINKS = [
  { label: 'X', ariaLabel: 'TradeSphere on Twitter/X' },
  { label: 'in', ariaLabel: 'TradeSphere on LinkedIn' },
  { label: '▶', ariaLabel: 'TradeSphere on YouTube' },
  { label: '◎', ariaLabel: 'TradeSphere on Instagram' },
];

export const FOOTER_COLUMNS: FooterLinkColumn[] = [
  {
    title: 'Product',
    ariaLabel: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Markets', href: '#charts' },
      { label: 'Charts & Indicators', href: '#charts' },
      { label: 'Mobile App (coming soon)', href: '#roadmap' },
    ],
  },
  {
    title: 'Company',
    ariaLabel: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '#footer' },
      { label: 'Blog', href: '#footer' },
      { label: 'Press', href: '#footer' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    ariaLabel: 'Resources',
    links: [
      { label: 'Help Center', href: '/faq' },
      { label: 'API Docs', href: '#footer' },
      { label: 'Community', href: '#footer' },
      { label: 'Market Status', href: '#footer' },
      { label: 'System Logs (admin)', href: '#footer' },
    ],
  },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: 'Terms of Service', href: '#footer' },
  { label: 'Privacy Policy', href: '#footer' },
  { label: 'Risk Disclosure', href: '#footer' },
  { label: 'KYC Policy', href: '#footer' },
  { label: 'Refund & Withdrawal Policy', href: '#footer' },
];

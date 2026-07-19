import type { LucideIcon } from 'lucide-react';

export type Theme = 'dark' | 'light';

export interface NavLink {
  label: string;
  href: string;
}

export interface TrustBullet {
  icon: LucideIcon;
  label: string;
}

export interface StatItem {
  count: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface StepItem {
  num: string;
  title: string;
  description: string;
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface SecurityItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}

export interface Testimonial {
  stars: string;
  starsLabel: string;
  quote: string;
  initials: string;
  name: string;
  role: string;
}

export interface RoadmapItem {
  tag: string;
  title: string;
  description: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FooterLinkColumn {
  title: string;
  ariaLabel: string;
  links: NavLink[];
}

export interface TickerRow {
  symbol: string;
  price: string;
  direction: 'up' | 'down';
  sparkline: string;
}

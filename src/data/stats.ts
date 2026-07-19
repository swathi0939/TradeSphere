import type { StatItem } from '@/types';

export const STATS: StatItem[] = [
  { count: 50000, suffix: '+', label: 'Trades executed' },
  { count: 12000, suffix: '+', label: 'Active traders' },
  { count: 99, suffix: '.9%', label: 'Platform uptime' },
  { count: 0, prefix: '₹', label: 'Hidden fees' },
];

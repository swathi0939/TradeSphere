import type { FaqItem } from '@/types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Is my money safe with TradeSphere?',
    answer:
      'Yes. Every transaction runs through Spring Security + JWT with encrypted transmission, and all sensitive actions require 2FA. Funds move only through verified UPI, bank, or card rails.',
  },
  {
    id: 'faq-2',
    question: 'How long does KYC verification take?',
    answer: 'KYC is fully digital and typically completes within minutes, so you can move from sign-up to your first trade the same day.',
  },
  {
    id: 'faq-3',
    question: 'What does the Starter plan actually include?',
    answer:
      'Real-time dashboard access, up to 3 watchlists, Market & Limit orders, basic Line/Candlestick charts, portfolio tracking, and email support — free, forever.',
  },
  {
    id: 'faq-4',
    question: 'Are there any hidden brokerage fees?',
    answer: 'No. Brokerage and transaction fees are shown transparently at order time, before you confirm any trade.',
  },
  {
    id: 'faq-5',
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes, you can move between Starter, Pro, and Elite at any time from your account settings — changes apply immediately.',
  },
];

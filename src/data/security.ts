import { Cpu, IdCard, KeyRound, Lock } from 'lucide-react';
import type { SecurityItem } from '@/types';

export const SECURITY_ITEMS: SecurityItem[] = [
  {
    icon: KeyRound,
    title: 'Two-Factor Authentication',
    description: 'Google Authenticator / OTP-based 2FA on every login and sensitive action.',
  },
  {
    icon: IdCard,
    title: 'KYC Verification',
    description: 'Fully digital identity verification, compliant with regulatory standards.',
  },
  {
    icon: Lock,
    title: 'Encrypted Transactions',
    description: 'Every fund movement and trade is encrypted end-to-end and logged for audit.',
  },
  {
    icon: Cpu,
    title: 'Spring Security + JWT',
    description: 'Enterprise-grade authentication architecture protecting every session.',
  },
];

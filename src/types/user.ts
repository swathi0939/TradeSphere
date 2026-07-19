export type KycStatus = 'verified' | 'pending' | 'rejected' | 'not_started';

export interface LinkedAccount {
  id: string;
  provider: 'google' | 'github' | 'bank';
  label: string;
  connectedAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  pan: string;
  kycStatus: KycStatus;
  twoFactorEnabled: boolean;
  linkedAccounts: LinkedAccount[];
  createdAt: string;
  plan: 'Starter' | 'Pro' | 'Elite';
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

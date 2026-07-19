import type { AuthCredentials, RegisterPayload, User } from '@/types';
import { delay, generateId } from './mockUtils';

const SESSION_KEY = 'tradesphere-session';
const OTP_KEY = 'tradesphere-otp-demo';
const RESET_EMAIL_KEY = 'tradesphere-reset-email';

const DEMO_USER: User = {
  id: 'usr_demo01',
  fullName: 'Ananya Rao',
  email: 'demo@tradesphere.app',
  phone: '+91 98765 43210',
  pan: 'ABCDE1234F',
  kycStatus: 'verified',
  twoFactorEnabled: true,
  linkedAccounts: [{ id: 'lnk_1', provider: 'google', label: 'demo@gmail.com', connectedAt: new Date().toISOString() }],
  createdAt: '2024-11-02T10:00:00.000Z',
  plan: 'Pro',
};

export class AuthError extends Error {}

export async function login({ email, password }: AuthCredentials): Promise<User> {
  if (!email || !password) {
    throw new AuthError('Email and password are required.');
  }
  if (password.length < 6) {
    await delay(null, 400);
    throw new AuthError('Incorrect email or password.');
  }
  const user: User = { ...DEMO_USER, email };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return delay(user, 600);
}

export async function register(payload: RegisterPayload): Promise<User> {
  if (payload.password !== payload.confirmPassword) {
    throw new AuthError('Passwords do not match.');
  }
  if (!payload.acceptTerms) {
    throw new AuthError('You must accept the Terms of Service.');
  }
  const user: User = {
    ...DEMO_USER,
    id: generateId('usr'),
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    kycStatus: 'not_started',
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return delay(user, 700);
}

export async function logout(): Promise<void> {
  window.localStorage.removeItem(SESSION_KEY);
  return delay(undefined, 200);
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export async function requestPasswordReset(email: string): Promise<{ otp: string }> {
  if (!email.includes('@')) throw new AuthError('Enter a valid email address.');
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  window.localStorage.setItem(OTP_KEY, otp);
  window.localStorage.setItem(RESET_EMAIL_KEY, email);
  // In a real app this would be emailed; surfaced here for the demo flow only.
  return delay({ otp }, 700);
}

export async function verifyOtp(code: string): Promise<{ verified: boolean }> {
  const stored = window.localStorage.getItem(OTP_KEY);
  if (!stored || code !== stored) {
    await delay(null, 400);
    throw new AuthError('Incorrect code. Please try again.');
  }
  return delay({ verified: true }, 500);
}

export async function resendOtp(): Promise<{ otp: string }> {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  window.localStorage.setItem(OTP_KEY, otp);
  return delay({ otp }, 500);
}

export async function resetPassword(newPassword: string): Promise<void> {
  if (newPassword.length < 8) throw new AuthError('Password must be at least 8 characters.');
  window.localStorage.removeItem(OTP_KEY);
  window.localStorage.removeItem(RESET_EMAIL_KEY);
  return delay(undefined, 500);
}

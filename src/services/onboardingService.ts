const STORAGE_KEY = 'tradesphere-onboarding-seen';

export function hasSeenOnboarding(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
}

export function markOnboardingSeen(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, 'true');
}

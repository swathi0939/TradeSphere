import { useCallback, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from '@/utils/constants';
import type { Theme } from '@/types';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : getSystemTheme();
}

/**
 * Owns the `data-theme` attribute on <html>, persists the user's choice,
 * and falls back to the OS preference on first visit. Mirrors the
 * original ThemeManager: one source of truth, read by every CSS custom
 * property in globals.css.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

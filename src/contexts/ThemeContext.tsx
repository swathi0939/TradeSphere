import { createContext, useContext, type ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Provides theme state to the whole tree. A context (rather than prop
 * drilling) because both the Navbar toggle and the canvas chart
 * components deep inside Hero/LiveCharts need to react to theme
 * changes — the canvases re-read CSS custom properties and redraw.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useTheme();
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within a ThemeProvider');
  return ctx;
}

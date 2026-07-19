import { Moon, Sun } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';

/** Dark/light toggle button — sun/moon swap based on the active theme. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title="Toggle dark / light mode"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid h-[38px] w-[38px] place-items-center rounded-full border border-border text-muted transition-[color,border-color,transform,background-color] duration-300 ease-spring hover:scale-[1.06] hover:-rotate-[14deg] hover:border-primary hover:bg-[rgba(var(--primary-rgb),.08)] hover:text-primary"
    >
      {theme === 'dark' ? <Moon size={20} aria-hidden /> : <Sun size={20} aria-hidden />}
    </button>
  );
}

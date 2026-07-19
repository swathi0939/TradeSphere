import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/Button';
import { LogoMark } from '@/components/LogoMark';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ROUTES } from '@/constants/routes';
import { NAV_LINKS } from '@/data/nav';
import { cn } from '@/utils/helpers';

interface NavbarProps {
  scrolled: boolean;
  activeHref: string | null;
}

/** Sticky top navigation — condenses on scroll, tracks the active section, and hosts the mobile menu. */
export function Navbar({ scrolled, activeHref }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-[500] border-b border-transparent backdrop-blur-[16px] backdrop-saturate-[1.4] transition-[border-color,background-color,box-shadow] duration-300 ease-brand',
        'bg-[color-mix(in_srgb,var(--bg)_72%,transparent)]',
        scrolled && 'border-border shadow-sm',
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          'mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-[18px] transition-[padding] duration-300 ease-brand',
          scrolled && 'py-3',
        )}
      >
        <a
          href="#top"
          aria-label="TradeSphere home"
          className="inline-flex items-center gap-[9px] text-[1.18rem] font-extrabold tracking-[-0.02em]"
        >
          <LogoMark />
          TradeSphere
        </a>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="navMenu"
          aria-label="Toggle navigation menu"
          className="relative z-[401] flex md:hidden"
        >
          {menuOpen ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
        </button>

        <ul
          id="navMenu"
          className={cn(
            'fixed inset-[0_0_0_30%] z-[400] flex h-dvh flex-col items-start justify-center gap-2 border-l border-border bg-surface p-8 transition-transform duration-[350ms] ease-brand',
            menuOpen ? 'translate-x-0' : 'translate-x-full',
            'md:static md:inset-auto md:z-auto md:flex md:h-auto md:translate-x-0 md:flex-row md:items-center md:justify-normal md:gap-1 md:border-l-0 md:bg-transparent md:p-0 md:transition-none',
          )}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'relative rounded-full px-[14px] py-[10px] text-[1.1rem] font-medium transition-colors duration-200 hover:text-text',
                  'md:py-2 md:text-[0.92rem]',
                  "after:content-[''] after:absolute after:right-[14px] after:bottom-[3px] after:left-[14px] after:h-0.5 after:origin-left after:scale-x-0 after:rounded-sm after:bg-primary after:transition-transform after:duration-300 after:ease-brand hover:after:scale-x-100",
                  activeHref === link.href ? 'text-text after:scale-x-100' : 'text-muted',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-[10px]">
          <ThemeToggle />
          <span className="hidden md:inline">
            <Button href={ROUTES.login} variant="text">
              Log In
            </Button>
          </span>
          <Button href={ROUTES.register} variant="primary" size="sm">
            Sign Up
          </Button>
        </div>
      </nav>
    </header>
  );
}

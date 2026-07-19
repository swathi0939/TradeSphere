import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from '@/components/LogoMark';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { ROUTES } from '@/constants/routes';

const FOOTER_LINKS = [
  { label: 'Home', href: ROUTES.home },
  { label: 'About', href: ROUTES.about },
  { label: 'Contact', href: ROUTES.contact },
  { label: 'FAQ', href: ROUTES.faq },
];

/**
 * Shell for standalone public pages (About, Contact, FAQ, Health, 404) that
 * aren't part of the pixel-parity-frozen landing page. Deliberately does
 * NOT reuse `sections/Navbar`/`sections/Footer` — those hardcode same-page
 * anchor hrefs (`#footer`, `#top`, …) tailored to being mounted only on
 * `/`, and would silently render broken links on any other route. This
 * layout composes the same underlying primitives those sections use
 * (`LogoMark`, `ThemeToggle`, `Button`, `Container`) with real app routes.
 */
export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="border-b border-border">
        <Container className="flex items-center justify-between gap-4 py-4">
          <Link to={ROUTES.home} aria-label="TradeSphere home" className="inline-flex items-center gap-2 text-[1.1rem] font-extrabold tracking-[-0.02em] text-text">
            <LogoMark size={20} />
            TradeSphere
          </Link>
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Button href={ROUTES.login} variant="ghost" size="sm">
              Log In
            </Button>
            <Button href={ROUTES.register} variant="primary" size="sm">
              Sign Up
            </Button>
          </div>
        </Container>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-6">
        <Container className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-[0.8rem] text-muted">© {new Date().getFullYear()} TradeSphere. All rights reserved.</p>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-4">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} to={link.href} className="text-[0.8rem] text-muted transition-colors hover:text-text">
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </footer>
    </div>
  );
}

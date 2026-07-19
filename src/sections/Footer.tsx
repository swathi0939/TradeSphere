import { useState, type FormEvent } from 'react';
import { LogoMark } from '@/components/LogoMark';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { FOOTER_COLUMNS, FOOTER_LEGAL_LINKS, FOOTER_SOCIAL_LINKS } from '@/data/nav';
import { SITE_TAGLINE } from '@/utils/constants';

/** Site footer — brand block, link columns, newsletter form, legal + risk disclaimer. */
export function Footer() {
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNote("You're on the list. Welcome to TradeSphere.");
    setEmail('');
  }

  return (
    <footer id="footer" className="bg-secondary pt-[72px] text-[#cfd8e8]">
      <Container className="grid grid-cols-1 gap-8 border-b border-white/8 pb-[50px] md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
        <div>
          <a href="#top" className="inline-flex items-center gap-[9px] text-[1.18rem] font-extrabold tracking-[-0.02em] text-white">
            <LogoMark />
            TradeSphere
          </a>
          <p className="mt-4 text-[0.9rem] font-semibold text-primary">&quot;{SITE_TAGLINE}&quot;</p>
          <p className="mt-2 text-[0.85rem] text-muted-on-dark">Real-time trading and investing, built secure.</p>
          <ul aria-label="Social media links" className="mt-6 flex gap-[10px]">
            {FOOTER_SOCIAL_LINKS.map((social) => (
              <li key={social.ariaLabel}>
                <a
                  // TODO: point at real social profile URLs once accounts exist
                  href="#footer"
                  aria-label={social.ariaLabel}
                  className="grid h-[34px] w-[34px] place-items-center rounded-full border border-white/15 text-[0.78rem] font-bold transition-[background-color,border-color,transform] duration-[250ms] ease-spring hover:-translate-y-[3px] hover:border-primary hover:bg-primary hover:text-[#04140f]"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.ariaLabel}>
            <h4 className="mb-6 text-[0.82rem] tracking-[0.06em] text-white uppercase">{column.title}</h4>
            <ul className="flex flex-col gap-[11px]">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[0.87rem] text-muted-on-dark transition-colors duration-200 hover:text-primary">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h4 className="mb-6 text-[0.82rem] tracking-[0.06em] text-white uppercase">Stay in the loop</h4>
          <form onSubmit={handleSubmit} className="mb-3 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletterEmail" className="sr-only">
              Email address
            </label>
            <input
              id="newsletterEmail"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 flex-1 rounded-sm border border-white/15 bg-white/5 px-[13px] py-[11px] text-white placeholder-[#7f8fa8] transition-[border-color,background-color] duration-200 focus-visible:border-primary focus-visible:bg-white/8"
            />
            <Button type="submit" variant="primary" size="sm">
              Subscribe
            </Button>
          </form>
          <p role="status" aria-live="polite" className="mb-8 min-h-[1.2em] text-[0.78rem] text-primary">
            {note}
          </p>

          <nav aria-label="Legal and compliance">
            <ul className="flex flex-col gap-[9px]">
              {FOOTER_LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[0.8rem] text-muted-on-dark">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <Container className="flex flex-col gap-3 px-6 py-[26px] pb-[34px]">
        <p className="max-w-[780px] text-[0.76rem] leading-[1.6] text-[#7f8fa8]">
          Investments in securities are subject to market risks. Read all scheme-related documents carefully before investing. Past
          performance is not indicative of future returns.
        </p>
        <p className="text-[0.8rem] text-[#7f8fa8]">&copy; 2026 TradeSphere Technologies. All rights reserved.</p>
      </Container>
    </footer>
  );
}

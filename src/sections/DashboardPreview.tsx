import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Button } from '@/components/Button';
import { Portfolio } from '@/sections/Portfolio';
import { useParallax } from '@/hooks/useScroll';
import { DASHBOARD_TICKERS } from '@/data/dashboard';
import { REVEAL_VIEWPORT, revealVariants } from '@/components/motion';
import { cn } from '@/utils/helpers';
import type { TickerRow } from '@/types';

function TickerCard({ ticker }: { ticker: TickerRow }) {
  const isUp = ticker.direction === 'up';
  return (
    <div className="bg-surface p-[18px] transition-colors duration-300 hover:bg-surface-2">
      <div className="mb-2 flex justify-between text-[0.92rem] font-bold">
        <span>{ticker.symbol}</span>
        <span className={cn('tabular-figures', isUp ? 'text-primary-text' : 'text-danger-text')}>{ticker.price}</span>
      </div>
      <svg className="h-[30px] w-full" viewBox="0 0 100 30" preserveAspectRatio="none">
        <polyline points={ticker.sparkline} fill="none" stroke={isUp ? 'var(--primary)' : 'var(--danger)'} strokeWidth={2} />
      </svg>
    </div>
  );
}

/** Live dashboard mockup with parallax-on-scroll, showcasing tickers + portfolio widget. */
export function DashboardPreview() {
  const visualRef = useRef<HTMLDivElement>(null);
  const offset = useParallax(visualRef);

  return (
    <section
      id="dashboard"
      aria-labelledby="dash-heading"
      className="bg-surface py-[var(--section-pad)] shadow-[inset_0_1px_0_var(--border),inset_0_-1px_0_var(--border)] max-md:py-14"
    >
      <Container className="grid grid-cols-1 items-center gap-14 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={REVEAL_VIEWPORT}>
          <SectionTitle
            eyebrow="THE COCKPIT"
            title="One dashboard. Every market signal."
            subtitle="Live prices, holdings, and order flow — rendered the instant it changes, with zero page refresh."
          />
          <Button href="#charts" variant="primary" className="mt-8">
            Create Your Free Account
          </Button>
        </motion.div>

        <div
          ref={visualRef}
          aria-hidden="true"
          style={{ transform: `translateY(${offset}px)` }}
          className="glass-card overflow-hidden rounded-lg will-change-transform"
        >
          <div className="flex items-center gap-2 border-b border-border p-[14px_18px]">
            <span className="h-[10px] w-[10px] rounded-full bg-danger" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#f5c542]" />
            <span className="h-[10px] w-[10px] rounded-full bg-primary" />
            <span className="ml-[10px] text-[0.8rem] text-muted">TradeSphere Dashboard</span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border">
            {DASHBOARD_TICKERS.map((ticker) => (
              <TickerCard key={ticker.symbol} ticker={ticker} />
            ))}
            <Portfolio />
          </div>
        </div>
      </Container>
    </section>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Button } from '@/components/Button';
import { HeroCandlestickChart } from '@/components/charts/HeroCandlestickChart';
import { TickerField } from '@/components/charts/TickerField';
import { useTilt } from '@/hooks/useAnimation';
import { TRUST_BULLETS } from '@/data/nav';
import { HERO_BASE_PRICE } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';

const INITIAL_PRICE = HERO_BASE_PRICE.toLocaleString('en-IN', { maximumFractionDigits: 2 });

/** Hero — headline, live candlestick chart, floating P&L card, and trust bullets. */
export function Hero() {
  const [price, setPrice] = useState({ value: INITIAL_PRICE, up: true });
  const [pnl, setPnl] = useState({ value: '+₹4,812.50', up: true });
  const { ref: tiltRef, onMouseMove: onTiltMouseMove, onMouseLeave: onTiltMouseLeave } = useTilt<HTMLDivElement>();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-[clamp(96px,12vw,130px)] pb-[60px] text-[#E6EDF3]"
    >
      <div aria-hidden="true" className="absolute inset-0 z-0 overflow-hidden">
        <div className="gradient-mesh" />
        <TickerField />
        <div className="grid-overlay" />
      </div>

      <div className="relative z-1 mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-5 pt-10 xl:grid-cols-[1.1fr_1fr] 2xl:px-6">
        <div>
          <motion.p
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            className="mb-6 text-[0.8rem] font-bold tracking-[0.14em] text-primary"
          >
            FINTECH · REAL-TIME · SECURE
          </motion.p>
          <motion.h1
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            transition={{ delay: staggerDelay(1) }}
            id="hero-heading"
            className="hero-heading-gradient text-h1 font-extrabold tracking-[-0.035em]"
          >
            Your Market. Your Move.
          </motion.h1>
          <motion.p
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            transition={{ delay: staggerDelay(2) }}
            className="mt-6 max-w-[520px] text-[1.15rem] text-muted-on-dark"
          >
            Buy and sell stocks in real time, analyze live charts with pro-grade indicators, and manage your money with bank-level security
            — all in one platform built for modern traders.
          </motion.p>
          <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            transition={{ delay: staggerDelay(3) }}
            className="mt-8 flex flex-col flex-wrap items-stretch gap-[14px] sm:flex-row"
          >
            <Button href="#pricing" variant="primary" size="lg">
              Start Trading Free
            </Button>
            <Button href="#charts" variant="ghost" size="lg" onDark>
              <Play size={18} aria-hidden />
              View Live Demo
            </Button>
          </motion.div>

          <motion.ul
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            transition={{ delay: staggerDelay(4) }}
            aria-label="Platform guarantees"
            className="mt-12 flex flex-col gap-[11px]"
          >
            {TRUST_BULLETS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-[10px] text-[0.88rem] text-muted-on-dark">
                <Icon size={16} className="shrink-0 text-primary" aria-hidden />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          aria-hidden="true"
          className="tilt-perspective relative mt-10 max-w-full md:max-w-[480px] xl:mt-0 xl:max-w-none"
        >
          <div
            ref={tiltRef}
            onMouseMove={onTiltMouseMove}
            onMouseLeave={onTiltMouseLeave}
            className={cn(
              'glass-card tilt-surface rounded-lg p-[22px] transition-[box-shadow] duration-300 ease-brand',
              'border-[rgba(255,255,255,0.1)] bg-[rgba(22,27,34,0.55)]',
            )}
          >
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-[0.85rem] font-bold tracking-[0.05em] text-muted-on-dark">NIFTY 50</span>
              <span
                className={cn(
                  'tabular-figures text-[1.2rem] font-extrabold transition-colors duration-300',
                  price.up ? 'text-primary' : 'text-danger',
                )}
              >
                {price.value}
              </span>
            </div>
            <HeroCandlestickChart
              onPriceChange={(value, up) => setPrice({ value, up })}
              onPnlChange={(value, up) => setPnl({ value, up })}
            />
          </div>

          <div className="glass-card floating absolute -bottom-[30px] -left-[30px] w-[220px] rounded-lg border-[rgba(255,255,255,0.1)] bg-[rgba(22,27,34,0.55)] p-[18px_22px] max-md:static max-md:mt-4 max-md:w-auto">
            <p className="text-[0.78rem] text-muted-on-dark">Portfolio P&amp;L Today</p>
            <p
              className={cn(
                'tabular-figures mt-1 text-[1.55rem] font-extrabold transition-colors duration-300',
                pnl.up ? 'text-primary' : 'text-danger',
              )}
            >
              {pnl.value}
            </p>
            <p className="mt-1 text-[0.78rem] text-primary">+2.34% · updating live</p>
          </div>
        </motion.div>
      </div>

      <div aria-hidden="true" className="pulse-divider mt-10" />
    </section>
  );
}

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '@/hooks/useAnimation';
import { Container } from '@/components/Container';
import { TrustedBy } from '@/sections/TrustedBy';
import { STATS } from '@/data/stats';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';
import type { StatItem } from '@/types';

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const display = useCountUp(stat.count, inView, stat.prefix, stat.suffix);

  return (
    <motion.div
      ref={ref}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      transition={{ delay: staggerDelay(index) }}
      className="rounded-lg px-4 py-6 text-center transition-[transform,background-color] duration-[350ms] ease-brand hover:-translate-y-1 hover:bg-surface"
    >
      <p className="tabular-figures text-stat font-extrabold tracking-[-0.02em] text-primary-text">{display}</p>
      <p className="mt-2 text-[0.9rem] text-muted">{stat.label}</p>
    </motion.div>
  );
}

/** Count-up stat strip + trusted-by logo row. */
export function TrustStrip() {
  return (
    <section id="trust" aria-label="Trust and adoption stats" className="border-b border-border py-16 pb-14">
      <Container className="grid grid-cols-2 gap-[14px] text-center sm:gap-6 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </Container>
      <TrustedBy />
    </section>
  );
}

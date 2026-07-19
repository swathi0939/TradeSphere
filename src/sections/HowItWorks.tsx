import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { STEPS } from '@/data/steps';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';

/** "Three steps to your first trade" onboarding overview. */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="hiw-heading" className="py-[var(--section-pad)] max-md:py-14">
      <Container>
        <SectionTitle
          eyebrow="GET STARTED"
          title="Three steps to your first trade"
          subtitle="No paperwork headaches. No waiting days for approval."
        />

        <ol className="relative mt-16 grid grid-cols-1 gap-7 lg:grid-cols-3 lg:max-w-none lg:mx-0 max-lg:mx-auto max-lg:max-w-[480px]">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.num}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: staggerDelay(i) }}
            >
              <Card className="relative h-full rounded-lg border border-border bg-surface p-[34px_28px] transition-[transform,border-color,box-shadow] duration-[350ms] ease-brand hover:-translate-y-1.5 hover:border-[rgba(var(--primary-rgb),0.35)] hover:shadow-md">
                <span className="mb-6 inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-primary bg-[rgba(var(--primary-rgb),0.08)] font-mono text-[0.82rem] font-bold text-primary">
                  {step.num}
                </span>
                <h3 className="mb-2 text-[1.18rem] tracking-[-0.01em] text-text">{step.title}</h3>
                <p className="text-[0.95rem] leading-[1.6] text-muted">{step.description}</p>
              </Card>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

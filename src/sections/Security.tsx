import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { SECURITY_ITEMS } from '@/data/security';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';

/** "Security & compliance, built in — not bolted on" grid. */
export function Security() {
  return (
    <section
      id="security"
      aria-labelledby="security-heading"
      className="bg-surface py-[var(--section-pad)] shadow-[inset_0_1px_0_var(--border),inset_0_-1px_0_var(--border)] max-md:py-14"
    >
      <Container>
        <SectionTitle
          eyebrow="TRUST BY DESIGN"
          title="Security & compliance, built in — not bolted on."
          subtitle="Markets are volatile. Your account's security shouldn't be."
        />

        <div className="mt-16 grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-4">
          {SECURITY_ITEMS.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: staggerDelay(i) }}
            >
              <Card className="h-full rounded-lg border border-border bg-bg p-[30px_26px] transition-[transform,box-shadow,border-color] duration-[400ms] ease-brand hover:-translate-y-[7px] hover:border-[rgba(var(--primary-rgb),0.35)] hover:shadow-md">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-md border border-[rgba(var(--primary-rgb),0.18)] bg-[linear-gradient(135deg,rgba(var(--primary-rgb),.16),rgba(var(--accent-rgb),.12))] text-primary">
                  <Icon size={22} aria-hidden />
                </div>
                <h3 className="mb-2 text-[1.03rem] tracking-[-0.01em] text-text">{title}</h3>
                <p className="text-[0.88rem] leading-[1.6] text-muted">{description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

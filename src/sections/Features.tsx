import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { FEATURES } from '@/data/features';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';

/** "Everything you need to trade with confidence" feature grid. */
export function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="py-[var(--section-pad)] max-md:py-14">
      <Container>
        <SectionTitle
          eyebrow="CAPABILITIES"
          title="Everything you need to trade with confidence."
          subtitle="One platform. Real-time data, secure funds, and pro tools."
        />

        <div className="mt-16 grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <motion.article
              key={title}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: staggerDelay(i) }}
            >
              <Card
                glass
                spotlight
                className="group h-full p-[30px_26px] transition-[transform,box-shadow,border-color] duration-[400ms] ease-brand hover:-translate-y-[7px] hover:border-[rgba(var(--primary-rgb),0.4)] hover:shadow-glow"
              >
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-md border border-[rgba(var(--primary-rgb),0.18)] bg-[linear-gradient(135deg,rgba(var(--primary-rgb),.16),rgba(var(--accent-rgb),.12))] text-primary transition-transform duration-[350ms] ease-spring group-hover:scale-[1.08] group-hover:-rotate-[4deg]">
                  <Icon size={22} aria-hidden />
                </div>
                <h3 className="mb-2 text-[1.06rem] tracking-[-0.01em] text-text">{title}</h3>
                <p className="text-[0.9rem] leading-[1.6] text-muted">{description}</p>
              </Card>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

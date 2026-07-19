import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { TESTIMONIALS } from '@/data/testimonials';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';

/** "Traders trust TradeSphere" testimonial grid. */
export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testi-heading" className="py-[var(--section-pad)] max-md:py-14">
      <Container>
        <SectionTitle eyebrow="SOCIAL PROOF" title="Traders trust TradeSphere." />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3 max-lg:mx-auto max-lg:max-w-[560px]">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: staggerDelay(i) }}
            >
              <Card
                glass
                className="h-full p-[30px_28px] transition-[transform,box-shadow] duration-[400ms] ease-brand hover:-translate-y-1.5 hover:shadow-lg"
              >
                <div className="mb-4 text-[0.95rem] tracking-[2px] text-[#f5c542]" aria-label={t.starsLabel}>
                  {t.stars}
                </div>
                <blockquote className="text-[0.97rem] leading-[1.65] text-text">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-[0.8rem] font-bold text-[#04140f] shadow-[0_4px_12px_-2px_rgba(var(--primary-rgb),0.4)]"
                  >
                    {t.initials}
                  </span>
                  <div>
                    <strong className="block text-[0.9rem] text-text">{t.name}</strong>
                    <span className="text-[0.78rem] text-muted">{t.role}</span>
                  </div>
                </figcaption>
              </Card>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

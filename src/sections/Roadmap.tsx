import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ROADMAP_ITEMS } from '@/data/roadmap';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';

/** "Built today. Growing fast." roadmap preview. */
export function Roadmap() {
  return (
    <section id="roadmap" aria-labelledby="roadmap-heading" className="py-[var(--section-pad)] max-md:py-14">
      <Container>
        <SectionTitle eyebrow="WHAT'S NEXT" title="Built today. Growing fast." />

        <div className="mt-16 grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-4">
          {ROADMAP_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: staggerDelay(i) }}
            >
              <Card className="h-full rounded-lg border border-border bg-surface p-[28px_24px] transition-[transform,border-color,box-shadow] duration-[400ms] ease-brand hover:-translate-y-1.5 hover:border-[rgba(var(--accent-rgb),0.4)] hover:shadow-[0_16px_40px_-16px_rgba(var(--accent-rgb),0.3)]">
                <Badge variant="outline-accent" className="mb-4">
                  {item.tag}
                </Badge>
                <h3 className="mb-2 text-[1rem] text-text">{item.title}</h3>
                <p className="text-[0.86rem] leading-[1.6] text-muted">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

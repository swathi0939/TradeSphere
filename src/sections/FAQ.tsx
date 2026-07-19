import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { FAQ_ITEMS } from '@/data/faq';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';
import { cn } from '@/utils/helpers';

/** Frequently asked questions — single-open accordion. */
export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-[var(--section-pad)] max-md:py-14">
      <Container>
        <SectionTitle eyebrow="QUESTIONS" title="Frequently asked questions" />

        <div className="mt-12 flex max-w-[780px] flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openId === item.id;
            const answerId = `${item.id}-answer`;
            return (
              <motion.div
                key={item.id}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={REVEAL_VIEWPORT}
                transition={{ delay: staggerDelay(i) }}
                className={cn(
                  'overflow-hidden rounded-md border bg-surface transition-colors duration-300',
                  isOpen ? 'border-[rgba(var(--primary-rgb),0.35)]' : 'border-border',
                )}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={item.id}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between gap-4 p-[20px_22px] text-left text-[0.98rem] font-semibold hover:text-primary"
                  >
                    {item.question}
                    <span className="relative h-5 w-5 shrink-0">
                      <span className="absolute top-1/2 left-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 bg-primary" />
                      <span
                        className={cn(
                          'absolute top-1/2 left-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-primary transition-transform duration-300 ease-brand',
                          isOpen && 'rotate-90 scale-0',
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={answerId}
                      role="region"
                      aria-labelledby={item.id}
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="p-[0_22px_20px] text-[0.92rem] leading-[1.6] text-muted">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

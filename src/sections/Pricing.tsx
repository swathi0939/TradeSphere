import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { SectionTitle } from '@/components/SectionTitle';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { PRICING_TIERS } from '@/data/pricing';
import { REVEAL_VIEWPORT, revealVariants, staggerDelay } from '@/components/motion';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/helpers';

/** Pricing tiers — Starter, Pro (featured), Elite. */
export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-[var(--section-pad)] max-md:py-14">
      <Container>
        <SectionTitle
          eyebrow="PRICING"
          title="Simple, transparent pricing. No hidden charges."
          subtitle="Brokerage/transaction fees shown transparently at order time."
        />

        <div className="mt-16 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3 max-lg:mx-auto max-lg:max-w-[480px]">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={REVEAL_VIEWPORT}
              transition={{ delay: staggerDelay(i) }}
            >
              <Card
                glass
                className={cn(
                  'relative flex h-full flex-col p-[36px_30px] transition-[transform,box-shadow,border-color] duration-[400ms] ease-brand hover:-translate-y-1.5',
                  tier.featured &&
                    'scale-100 border-primary bg-[linear-gradient(180deg,rgba(var(--primary-rgb),.06),transparent_40%),var(--glass-bg)] shadow-[var(--shadow-glow),var(--shadow-lg)] lg:scale-[1.03] lg:hover:-translate-y-1.5 lg:hover:scale-[1.03]',
                )}
              >
                {tier.badge && (
                  <Badge variant="solid" className="absolute top-[-14px] left-1/2 -translate-x-1/2">
                    {tier.badge}
                  </Badge>
                )}
                <h3 className="text-[1.1rem] font-bold text-muted">{tier.name}</h3>
                <p className="mt-3 text-[2.3rem] font-extrabold tracking-[-0.02em] text-text">
                  {tier.price} <span className="text-[0.9rem] font-medium text-muted">{tier.period}</span>
                </p>
                <ul className="mt-7 mb-[30px] flex flex-grow flex-col gap-[13px]">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="relative pl-[26px] text-[0.9rem] leading-[1.5] text-muted before:absolute before:top-px before:left-0 before:flex before:h-[17px] before:w-[17px] before:items-center before:justify-center before:rounded-full before:bg-[rgba(var(--primary-rgb),0.12)] before:text-[0.6rem] before:font-extrabold before:text-primary before:content-['✓']"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  href={tier.cta === 'Contact Sales' ? ROUTES.contact : ROUTES.register}
                  variant={tier.featured ? 'primary' : 'ghost'}
                  block
                >
                  {tier.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

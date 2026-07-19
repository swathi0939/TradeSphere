import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { REVEAL_VIEWPORT, revealVariants } from '@/components/motion';

/** Final "Ready to make your move?" conversion banner. */
export function CTA() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden py-[130px] text-center text-[#E6EDF3]">
      <div className="gradient-mesh absolute inset-0 z-0 opacity-90" aria-hidden="true" />
      <motion.div variants={revealVariants} initial="hidden" whileInView="visible" viewport={REVEAL_VIEWPORT} className="relative z-1">
        <Container>
          <h2 id="cta-heading" className="mx-auto max-w-[720px] text-h2 font-extrabold tracking-[-0.025em]">
            Ready to make your move?
          </h2>
          <p className="mx-auto mt-6 mb-[34px] max-w-[480px] text-[1.08rem] text-muted-on-dark">
            Join thousands of traders. Sign up in minutes, verify KYC, and start trading today.
          </p>
          <Button href="#pricing" variant="primary" size="lg">
            Get Started — It&apos;s Free
          </Button>
        </Container>
      </motion.div>
    </section>
  );
}

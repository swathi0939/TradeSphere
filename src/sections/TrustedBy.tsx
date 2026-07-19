import { motion } from 'framer-motion';
import { TRUSTED_BY_LOGOS } from '@/data/nav';
import { REVEAL_VIEWPORT, revealVariants } from '@/components/motion';

/** "Trusted by traders who also track" logo row — rendered inside TrustStrip. */
export function TrustedBy() {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      className="mt-[52px] text-center"
    >
      <p className="mb-6 text-[0.82rem] tracking-[0.06em] text-muted uppercase">Trusted by traders who also track</p>
      <ul className="flex flex-wrap justify-center gap-9">
        {TRUSTED_BY_LOGOS.map((logo) => (
          <li
            key={logo}
            className="font-bold tracking-[0.03em] text-muted opacity-65 transition-[opacity,color,transform] duration-[250ms] ease-brand hover:-translate-y-0.5 hover:text-primary hover:opacity-100"
          >
            {logo}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

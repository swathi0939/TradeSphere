import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { REVEAL_VIEWPORT, revealVariants } from '@/components/motion';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
}

/**
 * Eyebrow + heading + optional subtitle, used at the top of every
 * section. Each line reveals with the same fade-and-rise, staggered by
 * 65ms — matching the original scroll-reveal's per-group stagger.
 */
export function SectionTitle({ eyebrow, title, subtitle, className, titleClassName }: SectionTitleProps) {
  return (
    <div className={className}>
      <motion.p
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        className={cn(
          'mb-3 inline-flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] text-primary uppercase',
          "before:content-[''] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary before:shadow-[0_0_0_3px_rgba(var(--primary-rgb),.18)]",
        )}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        transition={{ delay: 0.065 }}
        className={cn('max-w-[720px] text-h2 font-extrabold tracking-[-0.025em] text-text', titleClassName)}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={revealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={REVEAL_VIEWPORT}
          transition={{ delay: 0.13 }}
          className="mt-4 max-w-[620px] text-[1.08rem] leading-[1.6] text-muted"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

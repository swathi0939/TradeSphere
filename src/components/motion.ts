import type { Variants } from 'framer-motion';

/**
 * Shared scroll-reveal config — fade-and-rise, matching the original
 * `.reveal`/`.in-view` CSS classes (26px rise, 0.8s brand-ease) but
 * implemented as a Framer Motion `whileInView` animation.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

/** Matches the original IntersectionObserver: 15% visible, -40px bottom margin, fires once. */
export const REVEAL_VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -40px 0px' } as const;

/** Per-sibling stagger step (65ms, capped at index 5) — mirrors the original group stagger. */
export function staggerDelay(index: number, step = 0.065, max = 5): number {
  return Math.min(index, max) * step;
}

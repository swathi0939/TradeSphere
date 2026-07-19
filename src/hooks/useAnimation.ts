import { useCallback, useEffect, useRef, useState } from 'react';
import { easeOutCubic, formatCount, getPrefersReducedMotion, getSupportsHover } from '@/utils/helpers';

/**
 * Count-up animation for stat numbers, triggered once `active` becomes
 * true (driven by a Framer Motion `whileInView`/`onViewportEnter` in
 * the consuming component). Mirrors the original's cubic-ease timing.
 */
export function useCountUp(target: number, active: boolean, prefix = '', suffix = '', duration = 1500): string {
  const [display, setDisplay] = useState(() => formatCount(getPrefersReducedMotion() ? target : 0, prefix, suffix));
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    // Under reduced motion the lazy initial state above already shows
    // the final value, so there's nothing left to animate.
    if (getPrefersReducedMotion()) return;

    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(formatCount(target * easeOutCubic(progress), prefix, suffix));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, prefix, suffix, duration]);

  return display;
}

/**
 * Magnetic pointer-follow effect for buttons. Mutates the element's
 * transform directly (rAF-throttled) rather than through React state,
 * so high-frequency mousemove events never trigger a re-render — the
 * same performance trade-off the original vanilla-JS version made.
 * No-ops on touch devices and under reduced-motion.
 */
export function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const rafRef = useRef<number | null>(null);
  const enabled = useRef(getSupportsHover() && !getPrefersReducedMotion());

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    if (!enabled.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top - rect.height / 2;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (ref.current) ref.current.style.transform = `translate(${mx * 0.18}px, ${my * 0.35}px)`;
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (ref.current) ref.current.style.transform = '';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

/**
 * Cursor-follow spotlight glow for card grids — sets --mx/--my custom
 * properties consumed by the `.spotlight::before` radial-gradient in
 * animations.css. Same direct-mutation performance approach as above.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const enabled = useRef(getSupportsHover() && !getPrefersReducedMotion());

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    if (!enabled.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    ref.current.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  return { ref, onMouseMove };
}

/** Subtle 3D tilt for the hero chart card, following the cursor. */
export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const enabled = useRef(getSupportsHover() && !getPrefersReducedMotion());

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    if (!enabled.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `rotateX(${py * -6}deg) rotateY(${px * 8}deg)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'rotateX(0) rotateY(0)';
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

import { useEffect, useRef, useState, type RefObject } from 'react';
import { BACK_TO_TOP_THRESHOLD, HEADER_SCROLL_THRESHOLD } from '@/utils/constants';
import { getPrefersReducedMotion } from '@/utils/helpers';

export interface ScrollState {
  scrolled: boolean;
  showBackToTop: boolean;
  activeHref: string | null;
}

/**
 * Single rAF-throttled scroll listener driving header condense state,
 * back-to-top visibility, and active nav-link tracking — one listener
 * instead of three, keeping scroll work off the main thread's critical
 * path (mirrors the original unified scroll pipeline in script.js).
 */
export function useScroll(navHrefs: readonly string[]): ScrollState {
  const [state, setState] = useState<ScrollState>({ scrolled: false, showBackToTop: false, activeHref: null });
  const tickingRef = useRef(false);

  useEffect(() => {
    const sectionEntries = navHrefs
      .map((href) => ({ href, el: document.querySelector<HTMLElement>(href) }))
      .filter((entry): entry is { href: string; el: HTMLElement } => entry.el !== null);

    function update() {
      const y = window.scrollY;
      const probe = y + window.innerHeight * 0.3;

      let activeHref: string | null = null;
      for (const { href, el } of sectionEntries) {
        if (el.offsetTop <= probe) activeHref = href;
      }

      setState({
        scrolled: y > HEADER_SCROLL_THRESHOLD,
        showBackToTop: y > BACK_TO_TOP_THRESHOLD,
        activeHref,
      });
      tickingRef.current = false;
    }

    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    }

    update();
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => document.removeEventListener('scroll', onScroll);
    // navHrefs is a stable module-level constant array in practice
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

/** Scrolls smoothly to the top of the page, respecting reduced-motion. */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: getPrefersReducedMotion() ? 'auto' : 'smooth' });
}

/**
 * Rubber-band parallax offset for an element as it crosses the
 * viewport — used by the Dashboard Preview mockup. Returns a
 * translateY in px, rAF-throttled off the same scroll event.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, strength = 30): number {
  const [offset, setOffset] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (getPrefersReducedMotion()) return;

    function update() {
      const node = ref.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (vh - rect.top) / (vh + rect.height);
        setOffset((progress - 0.5) * strength);
      }
      tickingRef.current = false;
    }

    function onScroll() {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    }

    update();
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => document.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strength]);

  return offset;
}

import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionOptions extends IntersectionObserverInit {
  /** Stop observing once the element has entered the viewport once. */
  once?: boolean;
}

/**
 * Generic IntersectionObserver wrapper. Used to gate expensive
 * off-screen work — canvas render loops, live-data intervals — so they
 * only run while their element is actually visible, matching the
 * original `whenVisible()` helper in script.js.
 */
export function useIntersection<T extends Element>(options: UseIntersectionOptions = {}) {
  const { once = false, threshold = 0.05, root = null, rootMargin = '0px' } = options;
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { threshold, root, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold, root, rootMargin]);

  return { ref, isIntersecting };
}

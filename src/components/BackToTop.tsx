import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '@/hooks/useScroll';
import { cn } from '@/utils/helpers';

interface BackToTopProps {
  visible: boolean;
}

/** Floating scroll-to-top button, revealed after the user scrolls past the hero. */
export function BackToTop({ visible }: BackToTopProps) {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        'fixed right-6 bottom-6 z-[400] grid h-[46px] w-[46px] place-items-center rounded-full bg-primary text-[#04140f] shadow-md',
        'transition-[opacity,transform] duration-300 ease-spring hover:-translate-y-[3px] hover:scale-[1.06]',
        visible ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-[10px] scale-90 opacity-0',
      )}
    >
      <ArrowUp size={20} aria-hidden />
    </button>
  );
}

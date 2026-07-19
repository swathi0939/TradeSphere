import { cn } from '@/utils/helpers';

interface LoaderProps {
  visible: boolean;
}

/** Honeycomb loading splash (Uiverse.io by boryanakrasteva), shown until the page settles. */
export function Loader({ visible }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading live market data"
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[22px] bg-bg',
        'transition-[opacity,visibility,filter] duration-[600ms] ease-brand',
        !visible && 'pointer-events-none invisible opacity-0 blur-[6px]',
      )}
    >
      <div className="honeycomb">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="text-[0.9rem] tracking-[0.04em] text-muted">Loading live markets…</p>
    </div>
  );
}

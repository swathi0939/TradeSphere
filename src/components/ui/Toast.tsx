import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/utils/helpers';
import type { ToastVariant } from '@/types';

const ICON: Record<ToastVariant, typeof Info> = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

const ACCENT: Record<ToastVariant, string> = {
  success: 'text-primary',
  error: 'text-danger',
  warning: 'text-[#f5c542]',
  info: 'text-accent',
};

/** Toast stack, rendered once near the app root and driven by ToastContext. */
export function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-[min(360px,calc(100vw-32px))] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICON[toast.variant];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card pointer-events-auto flex items-start gap-3 rounded-md p-3.5 shadow-lg"
            >
              <Icon size={19} className={cn('mt-0.5 shrink-0', ACCENT[toast.variant])} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[0.88rem] font-semibold text-text">{toast.title}</p>
                {toast.description && <p className="mt-0.5 text-[0.8rem] text-muted">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-muted transition-colors hover:text-text"
              >
                <X size={16} aria-hidden />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

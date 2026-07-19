import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface SpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

/** Simple brand-colored loading spinner. */
export function Spinner({ size = 22, className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block animate-spin rounded-full border-2 border-border border-t-primary', className)}
      style={{ width: size, height: size }}
    />
  );
}

export function FullPageSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.2 }}
      className="flex min-h-[50vh] items-center justify-center"
    >
      <Spinner size={32} />
    </motion.div>
  );
}

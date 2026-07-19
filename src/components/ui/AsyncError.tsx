import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { cn } from '@/utils/helpers';

interface AsyncErrorProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

/** Retry panel for a failed `useAsync` fetch — `useAsync` has always
 * returned `error`/`refetch`, but no page rendered them; this is the
 * shared component that finally surfaces that state to the user. */
export function AsyncError({ message, onRetry, className }: AsyncErrorProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-10 text-center', className)}>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[rgba(255,77,79,0.1)] text-danger-text">
        <AlertCircle size={20} aria-hidden />
      </span>
      <div>
        <p className="font-semibold text-text">Couldn't load this data</p>
        <p className="mt-1 text-[0.85rem] text-muted">{message}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Consistent "nothing here yet" block — icon, title, optional description
 * and action — replacing the one-off empty-state markup that had
 * accumulated independently across several pages. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center', className)}>
      <span className="mb-3 text-muted" aria-hidden="true">
        {icon}
      </span>
      <p className="font-semibold text-text">{title}</p>
      {description && <p className="mt-1 max-w-xs text-[0.85rem] text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

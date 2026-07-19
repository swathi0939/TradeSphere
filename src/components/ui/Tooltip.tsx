import { useId, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}

const SIDE_CLASSES: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
};

/** Hover/focus tooltip — pure CSS group-hover, no positioning library needed. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const tooltipId = useId();

  return (
    <span className={cn('group relative inline-flex', className)}>
      <span aria-describedby={tooltipId} className="inline-flex">
        {children}
      </span>
      <span
        role="tooltip"
        id={tooltipId}
        className={cn(
          'pointer-events-none absolute z-50 rounded-sm bg-secondary px-2.5 py-1.5 text-[0.76rem] whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-150',
          'group-hover:opacity-100 group-focus-within:opacity-100',
          SIDE_CLASSES[side],
        )}
      >
        {content}
      </span>
    </span>
  );
}

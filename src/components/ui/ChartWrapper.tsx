import type { ReactNode } from 'react';
import { Card } from '@/components/Card';
import { cn } from '@/utils/helpers';

interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Consistent card frame for chart sections — title/subtitle + optional action slot. */
export function ChartWrapper({ title, subtitle, actions, children, className }: ChartWrapperProps) {
  return (
    <Card glass className={cn('p-5', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[1rem] font-bold text-text">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[0.8rem] text-muted">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </Card>
  );
}

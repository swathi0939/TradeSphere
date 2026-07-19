import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

type BadgeVariant = 'solid' | 'outline-primary' | 'outline-accent';

interface BadgeProps {
  variant?: BadgeVariant;
  active?: boolean;
  className?: string;
  children: ReactNode;
}

const VARIANT: Record<BadgeVariant, string> = {
  solid: 'bg-primary text-[#04140f] shadow-[0_6px_16px_-4px_rgba(var(--primary-rgb),.6)]',
  'outline-primary': 'border border-primary text-primary-text bg-[rgba(var(--primary-rgb),.08)]',
  'outline-accent': 'border border-accent text-accent-text bg-[rgba(var(--accent-rgb),.08)]',
};

const INACTIVE = 'border border-border text-muted bg-transparent';

/** Small pill label — pricing "Most Popular", roadmap "Coming Soon", chart tabs. */
export function Badge({ variant = 'solid', active = true, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full text-[0.72rem] font-bold tracking-[0.03em]',
        'px-[10px] py-[3px]',
        active ? VARIANT[variant] : INACTIVE,
        className,
      )}
    >
      {children}
    </span>
  );
}

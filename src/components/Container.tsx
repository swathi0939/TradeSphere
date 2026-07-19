import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** Max-width content wrapper — matches the original `.container` exactly. */
export function Container({ children, className }: ContainerProps) {
  return <div className={cn('mx-auto max-w-[1200px] px-5 2xl:px-6', className)}>{children}</div>;
}

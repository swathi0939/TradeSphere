import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { useSpotlight } from '@/hooks/useAnimation';
import { cn } from '@/utils/helpers';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  glass?: boolean;
  spotlight?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Base card surface reused by every card-style block on the site
 * (features, security, pricing, testimonials, steps, roadmap, stats).
 * Handles the two effects shared across all of them — glassmorphism
 * and the cursor-follow spotlight glow — while each section keeps
 * control of its own padding, grid placement, and hover treatment via
 * `className`, since those genuinely differ card to card.
 */
export function Card({ as: Tag = 'div', glass = false, spotlight = false, className, children, ...rest }: CardProps) {
  const { ref, onMouseMove } = useSpotlight<HTMLElement>();

  return (
    <Tag
      ref={spotlight ? ref : undefined}
      onMouseMove={spotlight ? onMouseMove : undefined}
      className={cn('rounded-lg', glass && 'glass-card', spotlight && 'spotlight', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useAnimation';
import { cn } from '@/utils/helpers';

type ButtonVariant = 'primary' | 'ghost' | 'text';
type ButtonSize = 'default' | 'sm' | 'lg';

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  /** Ghost buttons rendered over the always-dark hero/CTA surfaces need lighter borders/text. */
  onDark?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsAnchor = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const BASE =
  'relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap ' +
  'transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-spring active:scale-[0.96]';

const SIZE: Record<ButtonSize, string> = {
  default: 'px-[26px] py-[13px] text-[0.95rem]',
  sm: 'px-[18px] py-[9px] text-[0.85rem]',
  lg: 'px-[34px] py-[16px] text-[1.05rem]',
};

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-[#04140f] shadow-[0_8px_24px_-8px_rgba(var(--primary-rgb),.55)] ' +
    'hover:shadow-[0_14px_34px_-10px_rgba(var(--primary-rgb),.75)] ' +
    "before:content-[''] before:absolute before:inset-0 before:-z-10 " +
    'before:bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,.55)_50%,transparent_80%)] ' +
    'before:-translate-x-[120%] before:transition-transform before:duration-700 before:ease-brand ' +
    'hover:before:translate-x-[120%]',
  ghost: 'bg-transparent border border-border hover:border-primary hover:text-primary-text hover:shadow-[0_0_0_4px_rgba(var(--primary-rgb),.1)]',
  text: 'bg-transparent text-muted px-3! py-2! hover:text-text',
};

// Two mutually-exclusive color classes (never combined with each other) —
// Tailwind resolves same-specificity utility conflicts by internal
// generation order, not by className string order, so layering
// `text-text` and `text-[#E6EDF3]` on the same element is unreliable.
const GHOST_TEXT_DEFAULT = 'text-text';
const GHOST_TEXT_ON_DARK = 'text-[#E6EDF3] border-white/25';

/**
 * Shared button used across every CTA in the site. Renders as a native
 * <button> or <a> depending on whether `href` is passed. Primary/ghost
 * variants get the original's magnetic pointer-follow effect; the
 * gloss-sweep highlight lives on the primary variant only, matching
 * the source design 1:1.
 */
export function Button({ variant = 'primary', size = 'default', block, onDark, className, children, href, ...rest }: ButtonProps) {
  const isMagnetic = variant === 'primary' || variant === 'ghost';
  const { ref: magneticRef, onMouseMove, onMouseLeave } = useMagnetic<HTMLButtonElement & HTMLAnchorElement>();

  const classes = cn(
    BASE,
    SIZE[size],
    VARIANT[variant],
    variant === 'ghost' && (onDark ? GHOST_TEXT_ON_DARK : GHOST_TEXT_DEFAULT),
    block && 'w-full',
    className,
  );

  const handlers = isMagnetic ? { onMouseMove, onMouseLeave } : {};
  const magneticProps = isMagnetic ? { ref: magneticRef } : {};

  if (href !== undefined) {
    return (
      <a href={href} className={classes} {...handlers} {...magneticProps} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...handlers} {...magneticProps} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

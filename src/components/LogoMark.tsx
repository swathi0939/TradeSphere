import { useId } from 'react';

/**
 * Diamond brand mark with a green-to-blue gradient fill. Uses
 * `useId()` for the gradient id so multiple instances (header +
 * footer) never collide — a real bug in the original static markup,
 * which shared one `#logoGrad` id across two SVGs.
 */
export function LogoMark({ size = 22 }: { size?: number }) {
  const gradientId = useId();

  return (
    <svg
      className="shrink-0 drop-shadow-[0_2px_8px_rgba(var(--primary-rgb),0.35)]"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <polygon points="12 1 23 12 12 23 1 12" fill={`url(#${gradientId})`} />
      <defs>
        <linearGradient id={gradientId} x1="1" y1="1" x2="23" y2="23">
          <stop offset="0" stopColor="#00C896" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

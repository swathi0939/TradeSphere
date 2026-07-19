import { cn } from '@/utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-8 w-8 text-[0.7rem]',
  md: 'h-10 w-10 text-[0.82rem]',
  lg: 'h-16 w-16 text-[1.3rem]',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** Circular user avatar — image if provided, otherwise initials on a brand gradient. */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return <img src={src} alt={name} loading="lazy" decoding="async" className={cn('rounded-full object-cover', SIZE[size], className)} />;
  }

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--accent))] font-bold text-[#04140f]',
        SIZE[size],
        className,
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}

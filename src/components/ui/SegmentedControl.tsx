import { useId, type KeyboardEvent } from 'react';
import { cn } from '@/utils/helpers';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Accessible 3-ish-way toggle (`role="radiogroup"`) for the shared
 * Conservative/Moderate/Aggressive scenario picker — roving `tabIndex` +
 * arrow-key navigation, active state styled like `Badge`'s solid variant. */
export function SegmentedControl<T extends string>({ options, value, onChange, label, className }: SegmentedControlProps<T>) {
  const groupId = useId();

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + delta + options.length) % options.length;
    const next = options[nextIndex];
    if (next) onChange(next.value);
  }

  return (
    <div role="radiogroup" aria-label={label} id={groupId} className={cn('inline-flex gap-1 rounded-full border border-border bg-surface-2 p-1', className)}>
      {options.map((option, index) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold whitespace-nowrap transition-colors duration-200',
              isActive ? 'bg-primary text-[#04140f] shadow-[0_4px_14px_-4px_rgba(var(--primary-rgb),.6)]' : 'text-muted hover:text-text',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

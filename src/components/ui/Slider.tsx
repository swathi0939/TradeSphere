import { useId, type ChangeEvent } from 'react';
import { cn } from '@/utils/helpers';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  hint?: string;
  className?: string;
}

/** Labeled range slider matching `Input`'s label/hint conventions — native
 * `<input type="range">` for free keyboard support and slider ARIA semantics,
 * themed via `accentColor` so it flips with the app's light/dark tokens. */
export function Slider({ label, min, max, step = 1, value, onChange, formatValue, hint, className }: SliderProps) {
  const id = useId();
  const format = formatValue ?? ((v: number) => v.toLocaleString('en-IN'));

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(Number(e.target.value));
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.85rem] font-medium text-text">
          {label}
        </label>
        <span className="tabular-figures text-[0.85rem] font-semibold text-primary-text">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        aria-valuetext={format(value)}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        style={{ accentColor: 'var(--primary)' }}
      />
      <div className="flex items-center justify-between text-[0.72rem] text-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      {hint && <p className="text-[0.78rem] text-muted">{hint}</p>}
    </div>
  );
}

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  hint?: string;
  leadingIcon?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

/** Text input with label, error/hint text, optional leading icon, and a password-reveal toggle. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leadingIcon, containerClassName, inputClassName, id, type = 'text', ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && revealed ? 'text' : type;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-[0.85rem] font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {/* The input box always pairs its own text with its own `bg-surface`
            (dark-on-white in light theme, light-on-dark in dark theme) —
            `text-[var(--text)]` reads the un-overridden root token directly,
            so this pairing stays correct even inside AuthLayout's card,
            which overrides the Tailwind-level `--color-text` for labels
            sitting on the dark card, not for content sitting on this box. */}
        {leadingIcon && <span className="pointer-events-none absolute left-3.5 text-[var(--text-muted)]">{leadingIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            'w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-[0.92rem] text-[var(--text)] transition-[border-color,box-shadow] duration-200',
            'placeholder:text-[var(--text-muted)] focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)] focus-visible:outline-none',
            Boolean(leadingIcon) && 'pl-10',
            isPassword && 'pr-10',
            error && 'border-danger focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_rgba(255,77,79,0.15)]',
            inputClassName,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute right-3 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            {revealed ? <EyeOff size={17} aria-hidden /> : <Eye size={17} aria-hidden />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-[0.78rem] text-danger-text">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-[0.78rem] text-muted">
          {hint}
        </p>
      )}
    </div>
  );
});

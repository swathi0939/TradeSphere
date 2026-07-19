import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ label, id, className, ...rest }, ref) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label htmlFor={checkboxId} className={cn('flex cursor-pointer items-start gap-2.5 text-[0.85rem] text-muted', className)}>
      <span className="relative mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center">
        <input ref={ref} id={checkboxId} type="checkbox" className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-sm border border-border bg-surface checked:border-primary checked:bg-primary" {...rest} />
        <Check size={12} className="pointer-events-none relative hidden text-[#04140f] peer-checked:block" aria-hidden />
      </span>
      {label}
    </label>
  );
});

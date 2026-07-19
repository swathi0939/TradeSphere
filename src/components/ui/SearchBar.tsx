import { Search, X } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** Icon-prefixed search input with a clear button. */
export function SearchBar({ value, onChange, placeholder = 'Search…', className }: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search size={16} className="pointer-events-none absolute left-3 text-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-border bg-surface py-2 pr-8 pl-9 text-[0.87rem] text-text placeholder:text-muted focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)] focus-visible:outline-none"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-3 text-muted hover:text-text">
          <X size={14} aria-hidden />
        </button>
      )}
    </div>
  );
}

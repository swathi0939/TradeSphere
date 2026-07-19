import type { ComponentType } from 'react';
import { GraduationCap, Home, PiggyBank, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import type { GoalPreset } from '@/types';

const PRESET_ICONS: Record<string, ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>> = {
  retirement: PiggyBank,
  home: Home,
  education: GraduationCap,
  wealth: TrendingUp,
};

interface GoalPresetPickerProps {
  presets: GoalPreset[];
  selectedId: string | null;
  onSelect: (preset: GoalPreset) => void;
}

/** Chip-style preset grid for common financial goals — selecting one seeds the target amount/years inputs. */
export function GoalPresetPicker({ presets, selectedId, onSelect }: GoalPresetPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {presets.map((preset) => {
        const Icon = PRESET_ICONS[preset.id] ?? PiggyBank;
        const isActive = preset.id === selectedId;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className={cn(
              'rounded-lg border p-3 text-left transition-colors',
              isActive ? 'border-primary bg-[rgba(var(--primary-rgb),0.08)]' : 'border-border hover:border-primary/40',
            )}
          >
            <Icon size={18} className="text-primary" aria-hidden />
            <p className="mt-2 text-[0.88rem] font-semibold text-text">{preset.label}</p>
            <p className="mt-0.5 text-[0.76rem] text-muted">
              {formatCurrency(preset.defaultTargetAmount, { maximumFractionDigits: 0 })} · {preset.defaultYears} yr
              {preset.defaultYears === 1 ? '' : 's'}
            </p>
          </button>
        );
      })}
    </div>
  );
}

import type { ComponentType } from 'react';
import { Coins, Gem, Scale, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { StrategyTemplate, StrategyTemplateId } from '@/types';

const TEMPLATE_ICONS: Record<StrategyTemplateId, ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>> = {
  growth: TrendingUp,
  value: Gem,
  dividend: Coins,
  momentum: Zap,
  balanced: Scale,
};

interface StrategyTemplatePickerProps {
  templates: StrategyTemplate[];
  selectedId: StrategyTemplateId;
  onSelect: (template: StrategyTemplate) => void;
}

/** Chip-style template grid for the AI Strategy Builder — selecting one drives which scoring formula screens the stock universe. */
export function StrategyTemplatePicker({ templates, selectedId, onSelect }: StrategyTemplatePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {templates.map((template) => {
        const Icon = TEMPLATE_ICONS[template.id];
        const isActive = template.id === selectedId;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            className={cn(
              'rounded-lg border p-3 text-left transition-colors',
              isActive ? 'border-primary bg-[rgba(var(--primary-rgb),0.08)]' : 'border-border hover:border-primary/40',
            )}
          >
            <Icon size={18} className="text-primary" aria-hidden />
            <p className="mt-2 text-[0.88rem] font-semibold text-text">{template.label}</p>
            <p className="mt-0.5 text-[0.74rem] text-muted">{template.description}</p>
          </button>
        );
      })}
    </div>
  );
}

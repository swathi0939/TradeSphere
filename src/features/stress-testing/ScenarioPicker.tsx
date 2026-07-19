import type { ComponentType } from 'react';
import { CloudRain, Flame, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { StressScenario, StressScenarioId } from '@/types';

const SCENARIO_ICONS: Record<StressScenarioId, ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>> = {
  bull: TrendingUp,
  bear: TrendingDown,
  inflation: Flame,
  recession: CloudRain,
  rateShock: Zap,
};

interface ScenarioPickerProps {
  scenarios: StressScenario[];
  selectedId: StressScenarioId;
  onSelect: (scenario: StressScenario) => void;
}

/** Chip-style scenario grid for Scenario & Stress Testing — selecting one drives which macro shock is applied to the real portfolio. */
export function ScenarioPicker({ scenarios, selectedId, onSelect }: ScenarioPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {scenarios.map((scenario) => {
        const Icon = SCENARIO_ICONS[scenario.id];
        const isActive = scenario.id === selectedId;

        return (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onSelect(scenario)}
            className={cn(
              'rounded-lg border p-3 text-left transition-colors',
              isActive ? 'border-primary bg-[rgba(var(--primary-rgb),0.08)]' : 'border-border hover:border-primary/40',
            )}
          >
            <Icon size={18} className="text-primary" aria-hidden />
            <p className="mt-2 text-[0.88rem] font-semibold text-text">{scenario.label}</p>
            <p className="mt-0.5 text-[0.74rem] text-muted">{scenario.description}</p>
          </button>
        );
      })}
    </div>
  );
}

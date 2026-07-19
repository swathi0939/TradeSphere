import { Card } from '@/components/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Slider } from '@/components/ui/Slider';
import { formatCurrency } from '@/services/mockUtils';
import { RETURN_SCENARIOS, type ReturnScenarioKey } from '@/utils/finance';

const SCENARIO_OPTIONS = Object.entries(RETURN_SCENARIOS).map(([value, scenario]) => ({
  value: value as ReturnScenarioKey,
  label: scenario.label,
}));

interface WhatIfControlsProps {
  monthlyContribution: number;
  onMonthlyContributionChange: (value: number) => void;
  horizonYears: number;
  onHorizonYearsChange: (value: number) => void;
  scenario: ReturnScenarioKey;
  onScenarioChange: (value: ReturnScenarioKey) => void;
}

export function WhatIfControls({
  monthlyContribution,
  onMonthlyContributionChange,
  horizonYears,
  onHorizonYearsChange,
  scenario,
  onScenarioChange,
}: WhatIfControlsProps) {
  return (
    <Card glass className="p-5">
      <div className="flex flex-col gap-5">
        <SegmentedControl label="Market Scenario" options={SCENARIO_OPTIONS} value={scenario} onChange={onScenarioChange} />

        <Slider
          label="Extra Monthly Investment"
          min={0}
          max={50000}
          step={500}
          value={monthlyContribution}
          onChange={onMonthlyContributionChange}
          formatValue={(v) => formatCurrency(v, { maximumFractionDigits: 0 })}
        />

        <Slider
          label="Time Horizon"
          min={1}
          max={30}
          step={1}
          value={horizonYears}
          onChange={onHorizonYearsChange}
          formatValue={(v) => `${v} yr${v === 1 ? '' : 's'}`}
        />
      </div>
    </Card>
  );
}

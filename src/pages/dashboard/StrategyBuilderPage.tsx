import { useDeferredValue, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Slider } from '@/components/ui/Slider';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { StrategyTemplatePicker } from '@/features/strategy-builder/StrategyTemplatePicker';
import { useStrategyResult } from '@/store/useStrategyBuilder';
import { getStrategyTemplates } from '@/services/strategyBuilderService';
import * as stocksService from '@/services/stocksService';
import { cn } from '@/utils/helpers';
import type { StrategyTemplateId } from '@/types';

const TEMPLATES = getStrategyTemplates();
const SECTORS = ['all', ...stocksService.getAllSectors()];

export default function StrategyBuilderPage() {
  const [template, setTemplate] = useState<StrategyTemplateId>('growth');
  const [riskTolerance, setRiskTolerance] = useState(5);
  const [sectorFocus, setSectorFocus] = useState<string>('all');

  const deferredRiskTolerance = useDeferredValue(riskTolerance);
  const { data } = useStrategyResult({ template, riskTolerance: deferredRiskTolerance, sectorFocus });
  const isStale = riskTolerance !== deferredRiskTolerance;

  return (
    <div>
      <PageHeader title="AI Strategy Builder" subtitle="Pick a strategy and let AI screen the market for stocks that fit." />

      <div className="mb-6">
        <StrategyTemplatePicker templates={TEMPLATES} selectedId={template} onSelect={(t) => setTemplate(t.id)} />
      </div>

      <Card glass className="p-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Slider
            label="Risk Tolerance"
            min={1}
            max={10}
            step={1}
            value={riskTolerance}
            onChange={setRiskTolerance}
            formatValue={(v) => `${v}/10`}
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-[0.85rem] font-medium text-text">Sector Focus</span>
            <Dropdown
              align="left"
              trigger={({ toggle }) => (
                <button
                  type="button"
                  onClick={toggle}
                  className="flex w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-[0.85rem] font-medium text-text transition-colors hover:border-primary/40"
                >
                  {sectorFocus === 'all' ? 'All Sectors' : sectorFocus}
                  <ChevronDown size={16} className="text-muted" aria-hidden />
                </button>
              )}
              panelClassName="w-full max-h-64 overflow-y-auto"
            >
              {SECTORS.map((sector) => (
                <DropdownItem key={sector} onClick={() => setSectorFocus(sector)}>
                  {sector === 'all' ? 'All Sectors' : sector}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </Card>

      <div className={cn('mt-6 transition-opacity', isStale && 'opacity-60')}>
        <ChartWrapper title="Matching Stocks" subtitle={data?.summary}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {!data
              ? Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
              : data.matches.map((match) => (
                  <div key={match.symbol} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-text">{match.symbol}</p>
                        <p className="text-[0.76rem] text-muted">{match.name}</p>
                      </div>
                      <Badge variant="outline-primary" active className="text-[0.68rem]">
                        {match.score}
                      </Badge>
                    </div>
                    <p className="mt-2.5 text-[0.8rem] text-muted">{match.rationale}</p>
                  </div>
                ))}
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
}

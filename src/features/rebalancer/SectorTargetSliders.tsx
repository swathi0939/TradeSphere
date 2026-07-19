import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Slider } from '@/components/ui/Slider';
import type { RebalanceTarget } from '@/types/rebalancer';

interface SectorTargetSlidersProps {
  sectors: { sector: string; currentPercent: number }[];
  targets: RebalanceTarget[];
  onTargetChange: (sector: string, value: number) => void;
}

/** Per-sector target-allocation sliders plus a running total badge that flags
 * when the targets don't yet sum to (roughly) 100%. */
export function SectorTargetSliders({ sectors, targets, onTargetChange }: SectorTargetSlidersProps) {
  const total = targets.reduce((sum, t) => sum + t.targetPercent, 0);
  const isBalanced = Math.abs(total - 100) <= 2;

  return (
    <Card glass className="p-5">
      <div className="flex flex-col gap-5">
        {sectors.map((sector) => {
          const target = targets.find((t) => t.sector === sector.sector);
          return (
            <Slider
              key={sector.sector}
              label={sector.sector}
              min={0}
              max={50}
              step={1}
              value={target?.targetPercent ?? 0}
              onChange={(v) => onTargetChange(sector.sector, v)}
              formatValue={(v) => `${v}%`}
              hint={`Currently ${sector.currentPercent.toFixed(1)}%`}
            />
          );
        })}
      </div>
      <div className="mt-5 flex justify-end">
        <Badge variant={isBalanced ? 'outline-primary' : 'outline-accent'}>Total: {total.toFixed(0)}%</Badge>
      </div>
    </Card>
  );
}

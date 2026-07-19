import { cn } from '@/utils/helpers';

export interface BarChartPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartPoint[];
  height?: number;
  className?: string;
}

/** Simple positive/negative bar chart (e.g. monthly returns) built with CSS, no canvas needed. */
export function BarChart({ data, height = 180, className }: BarChartProps) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.value)), 1);

  return (
    <div className={cn('flex items-end gap-2', className)} style={{ height }}>
      {data.map((point) => {
        const barHeightPercent = (Math.abs(point.value) / maxAbs) * 100;
        const isPositive = point.value >= 0;
        return (
          <div key={point.label} className="flex flex-1 flex-col items-center justify-end gap-1.5" style={{ height: '100%' }}>
            <div className="flex flex-1 w-full flex-col justify-end">
              <div
                className={cn('w-full rounded-t-sm transition-all duration-500 ease-out', isPositive ? 'bg-primary' : 'bg-danger')}
                style={{ height: `${barHeightPercent}%`, minHeight: 2 }}
                title={`${point.label}: ${point.value.toFixed(2)}%`}
              />
            </div>
            <span className="text-[0.68rem] text-muted">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}

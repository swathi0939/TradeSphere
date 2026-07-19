import { Fragment } from 'react';
import { cn } from '@/utils/helpers';

interface HeatmapGridProps {
  rowLabels: string[];
  colLabels: string[];
  values: number[][];
  colorScale: (value: number) => string;
  formatValue?: (value: number) => string;
  className?: string;
}

const defaultFormatValue = (value: number) => value.toFixed(2);

/** Generic colored-cell grid — reused for both the correlation matrix and the sector
 * exposure heatmap. Deliberately has no correlation/sector-specific knowledge. */
export function HeatmapGrid({ rowLabels, colLabels, values, colorScale, formatValue = defaultFormatValue, className }: HeatmapGridProps) {
  return (
    <div className={cn('inline-grid gap-1', className)} style={{ gridTemplateColumns: `auto repeat(${colLabels.length}, minmax(44px, 1fr))` }}>
      <div />
      {colLabels.map((label) => (
        <div key={label} className="flex items-end justify-center px-1 pb-1 text-[0.68rem] text-muted truncate">
          {label}
        </div>
      ))}
      {rowLabels.map((rowLabel, i) => (
        <Fragment key={rowLabel}>
          <div className="flex items-center pr-2 text-[0.68rem] font-semibold text-text truncate">{rowLabel}</div>
          {colLabels.map((colLabel, j) => {
            const value = values[i]?.[j] ?? 0;
            return (
              <div
                key={`${rowLabel}-${colLabel}`}
                role="img"
                aria-label={`${rowLabel} × ${colLabel}: ${formatValue(value)}`}
                className="grid min-w-[44px] h-[36px] place-items-center rounded-sm text-[0.62rem] font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
                style={{ backgroundColor: colorScale(value) }}
              >
                {formatValue(value)}
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

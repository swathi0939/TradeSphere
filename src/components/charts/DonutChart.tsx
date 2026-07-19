export interface DonutChartSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
}

interface DonutChartProps {
  data: DonutChartSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

/** SVG donut chart for sector/asset allocation, with a legend. */
export function DonutChart({ data, size = 180, strokeWidth = 22, centerLabel, centerValue, className }: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Percent-so-far before each slice, used as its stroke-dashoffset — computed
  // up front (not mutated during the render map) so it stays render-pure.
  const precedingPercents = data.map((_, index) => data.slice(0, index).reduce((sum, s) => sum + s.percent, 0));

  return (
    <div className={className}>
      <div className="flex items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
          {data.map((slice, index) => {
            const dashLength = (slice.percent / 100) * circumference;
            const dashOffset = -(((precedingPercents[index] ?? 0) / 100) * circumference);
            return (
              <circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                className="transition-all duration-500 ease-out"
              />
            );
          })}
          {centerValue && (
            <g className="rotate-90" style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}>
              <text x={size / 2} y={size / 2 - 6} textAnchor="middle" className="fill-text text-[1.05rem] font-extrabold">
                {centerValue}
              </text>
              {centerLabel && (
                <text x={size / 2} y={size / 2 + 14} textAnchor="middle" className="fill-current text-[0.7rem] text-muted">
                  {centerLabel}
                </text>
              )}
            </g>
          )}
        </svg>

        <ul className="flex flex-1 flex-col gap-2.5">
          {data.map((slice) => (
            <li key={slice.label} className="flex items-center justify-between gap-3 text-[0.85rem]">
              <span className="flex items-center gap-2 text-text">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} aria-hidden="true" />
                {slice.label}
              </span>
              <span className="font-semibold text-muted">{slice.percent.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { formatCurrency } from '@/services/mockUtils';

export interface LineAreaChartPoint {
  label: string;
  value: number;
}

interface LineAreaChartProps {
  data: LineAreaChartPoint[];
  height?: number;
  color?: string;
  className?: string;
  valueFormatter?: (value: number) => string;
}

/** Canvas line/area chart with gradient fill and hover crosshair — performance graphs, price history. */
export function LineAreaChart({ data, height = 220, color, className, valueFormatter }: LineAreaChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { theme } = useThemeContext();
  const format = valueFormatter ?? ((v: number) => formatCurrency(v, { maximumFractionDigits: 0 }));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || data.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const styles = getComputedStyle(document.documentElement);
    const lineColor = color ?? (styles.getPropertyValue('--primary').trim() || '#00C896');
    const gridColor = styles.getPropertyValue('--border').trim() || 'rgba(255,255,255,.1)';
    const mutedColor = styles.getPropertyValue('--text-muted').trim() || '#8B949E';

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const padding = { top: 16, bottom: 24, left: 0, right: 0 };
    const chartHeight = height - padding.top - padding.bottom;

    const xFor = (i: number) => (i / (data.length - 1)) * width;
    const yFor = (v: number) => padding.top + chartHeight - ((v - min) / range) * chartHeight;

    ctx.clearRect(0, 0, width, height);

    // Horizontal grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (chartHeight / 3) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Gradient area fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, `${lineColor}33`);
    gradient.addColorStop(1, `${lineColor}00`);
    ctx.beginPath();
    ctx.moveTo(0, yFor(data[0]?.value ?? 0));
    data.forEach((d, i) => ctx.lineTo(xFor(i), yFor(d.value)));
    ctx.lineTo(width, height - padding.bottom);
    ctx.lineTo(0, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = xFor(i);
      const y = yFor(d.value);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Hover crosshair
    if (hoverIndex !== null && data[hoverIndex]) {
      const x = xFor(hoverIndex);
      const y = yFor(data[hoverIndex].value);
      ctx.strokeStyle = gridColor;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
      ctx.strokeStyle = styles.getPropertyValue('--surface').trim() || '#161B22';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // X axis labels (first, middle, last)
    ctx.fillStyle = mutedColor;
    ctx.font = '11px Inter, sans-serif';
    ctx.textBaseline = 'top';
    const labelY = height - padding.bottom + 6;
    const first = data[0];
    const mid = data[Math.floor(data.length / 2)];
    const last = data[data.length - 1];
    if (first) {
      ctx.textAlign = 'left';
      ctx.fillText(first.label, 0, labelY);
    }
    if (mid) {
      ctx.textAlign = 'center';
      ctx.fillText(mid.label, width / 2, labelY);
    }
    if (last) {
      ctx.textAlign = 'right';
      ctx.fillText(last.label, width, labelY);
    }
  }, [data, width, height, color, hoverIndex, theme]);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (data.length < 2 || width === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const index = Math.round((x / width) * (data.length - 1));
    setHoverIndex(Math.max(0, Math.min(data.length - 1, index)));
  }

  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', height }}>
      <canvas ref={canvasRef} onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIndex(null)} />
      {hovered && (
        <div
          className="glass-card pointer-events-none absolute top-2 rounded-md px-3 py-2 text-[0.78rem]"
          style={{ left: Math.min(Math.max((hoverIndex! / (data.length - 1)) * width - 60, 0), width - 130) }}
        >
          <p className="font-semibold text-text">{format(hovered.value)}</p>
          <p className="text-muted">{hovered.label}</p>
        </div>
      )}
    </div>
  );
}

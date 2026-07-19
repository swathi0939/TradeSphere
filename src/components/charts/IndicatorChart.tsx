import { useEffect, useRef } from 'react';
import { useIntersection } from '@/hooks/useIntersection';
import { useThemeContext } from '@/contexts/ThemeContext';
import { getPrefersReducedMotion } from '@/utils/helpers';
import { INDICATOR_POINT_COUNT, INDICATOR_TICK_INTERVAL_MS } from '@/utils/constants';

function seedLine(seed: number, min: number, max: number, step: number): number[] {
  const line: number[] = [];
  let value = seed;
  for (let i = 0; i < INDICATOR_POINT_COUNT; i++) {
    value += (Math.random() - 0.5) * step;
    value = Math.max(min, Math.min(max, value));
    line.push(value);
  }
  return line;
}

function tickLine(line: number[], min: number, max: number, step: number): number[] {
  const next = line.slice(1);
  const last = next[next.length - 1] ?? line[line.length - 1] ?? min;
  const value = Math.max(min, Math.min(max, last + (Math.random() - 0.5) * step));
  next.push(value);
  return next;
}

/** Simulated RSI oscillator + price line, for the "Live Charts" section. */
export function IndicatorChart() {
  const { ref, isIntersecting } = useIntersection<HTMLCanvasElement>({ threshold: 0.05 });
  const priceLineRef = useRef<number[]>(seedLine(220 * 0.55, 30, 220 * 0.6, 14));
  const rsiLineRef = useRef<number[]>(seedLine(50, 15, 85, 8));
  const { theme } = useThemeContext();

  function draw() {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const priceLine = priceLineRef.current;
    const rsiLine = rsiLineRef.current;

    ctx.clearRect(0, 0, W, H);
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--accent').trim() || '#3B82F6';
    const primary = styles.getPropertyValue('--primary').trim() || '#00C896';
    const muted = styles.getPropertyValue('--border').trim() || 'rgba(255,255,255,.1)';

    const priceTop = 0;
    const priceH = H * 0.62;
    const rsiTop = H * 0.68;
    const rsiH = H * 0.3;

    ctx.strokeStyle = muted;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, rsiTop);
    ctx.lineTo(W, rsiTop);
    ctx.stroke();

    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    priceLine.forEach((val, i) => {
      const x = (i / (INDICATOR_POINT_COUNT - 1)) * W;
      const y = priceTop + priceH - (val / H) * priceH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,77,79,0.35)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, rsiTop + rsiH * 0.3);
    ctx.lineTo(W, rsiTop + rsiH * 0.3);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,200,150,0.35)';
    ctx.beginPath();
    ctx.moveTo(0, rsiTop + rsiH * 0.7);
    ctx.lineTo(W, rsiTop + rsiH * 0.7);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    rsiLine.forEach((val, i) => {
      const x = (i / (INDICATOR_POINT_COUNT - 1)) * W;
      const y = rsiTop + rsiH - (val / 100) * rsiH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    if (getPrefersReducedMotion() || !isIntersecting) return;

    const id = setInterval(() => {
      priceLineRef.current = tickLine(priceLineRef.current, 30, 220 * 0.6, 14);
      rsiLineRef.current = tickLine(rsiLineRef.current, 15, 85, 8);
      draw();
    }, INDICATOR_TICK_INTERVAL_MS);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);

  return <canvas ref={ref} width={520} height={240} />;
}

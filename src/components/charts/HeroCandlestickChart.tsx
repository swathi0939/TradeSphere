import { useEffect, useRef } from 'react';
import { useIntersection } from '@/hooks/useIntersection';
import { useThemeContext } from '@/contexts/ThemeContext';
import { formatSignedRupees, getPrefersReducedMotion } from '@/utils/helpers';
import { HERO_BASE_PRICE, HERO_CANDLE_COUNT, HERO_TICK_INTERVAL_MS } from '@/utils/constants';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
}

interface HeroCandlestickChartProps {
  onPriceChange: (price: string, up: boolean) => void;
  onPnlChange: (pnl: string, up: boolean) => void;
}

function seedCandles(): Candle[] {
  const candles: Candle[] = [];
  let price = HERO_BASE_PRICE - 60;
  for (let i = 0; i < HERO_CANDLE_COUNT; i++) {
    const open = price;
    const close = open + (Math.random() - 0.48) * 14;
    const high = Math.max(open, close) + Math.random() * 6;
    const low = Math.min(open, close) - Math.random() * 6;
    candles.push({ open, close, high, low });
    price = close;
  }
  return candles;
}

function pushCandle(candles: Candle[]): Candle[] {
  const last = candles[candles.length - 1];
  if (!last) return candles;
  const open = last.close;
  const close = open + (Math.random() - 0.47) * 14;
  const high = Math.max(open, close) + Math.random() * 6;
  const low = Math.min(open, close) - Math.random() * 6;
  const next = [...candles, { open, close, high, low }];
  return next.length > HERO_CANDLE_COUNT ? next.slice(next.length - HERO_CANDLE_COUNT) : next;
}

/** Animated, simulated-live NIFTY 50 candlestick chart for the hero visual. */
export function HeroCandlestickChart({ onPriceChange, onPnlChange }: HeroCandlestickChartProps) {
  const { ref, isIntersecting } = useIntersection<HTMLCanvasElement>({ threshold: 0.05 });
  const candlesRef = useRef<Candle[]>(seedCandles());
  const { theme } = useThemeContext();

  function draw() {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const candles = candlesRef.current;

    ctx.clearRect(0, 0, W, H);
    const allVals = candles.flatMap((c) => [c.high, c.low]);
    const max = Math.max(...allVals);
    const min = Math.min(...allVals);
    const range = max - min || 1;
    const padding = 10;
    const slot = W / candles.length;
    const bodyW = slot * 0.55;

    const styles = getComputedStyle(document.documentElement);
    const upColor = styles.getPropertyValue('--primary').trim() || '#00C896';
    const downColor = styles.getPropertyValue('--danger').trim() || '#FF4D4F';

    candles.forEach((c, i) => {
      const x = i * slot + slot / 2;
      const yFor = (v: number) => H - padding - ((v - min) / range) * (H - padding * 2);
      const up = c.close >= c.open;
      ctx.strokeStyle = ctx.fillStyle = up ? upColor : downColor;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(x, yFor(c.high));
      ctx.lineTo(x, yFor(c.low));
      ctx.stroke();

      const yOpen = yFor(c.open);
      const yClose = yFor(c.close);
      const top = Math.min(yOpen, yClose);
      const bodyH = Math.max(Math.abs(yClose - yOpen), 1.5);
      ctx.fillRect(x - bodyW / 2, top, bodyW, bodyH);
    });
  }

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw when the theme flips (colors are read live from CSS vars).
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Live tick loop, gated by on-screen visibility and reduced-motion.
  useEffect(() => {
    if (getPrefersReducedMotion() || !isIntersecting) return;

    const id = setInterval(() => {
      candlesRef.current = pushCandle(candlesRef.current);
      draw();

      const candles = candlesRef.current;
      const last = candles[candles.length - 1];
      const prevClose = candles[candles.length - 2]?.close ?? last?.open;
      if (last && prevClose !== undefined) {
        const up = last.close >= prevClose;
        onPriceChange(last.close.toLocaleString('en-IN', { maximumFractionDigits: 2 }), up);
      }

      const delta = Math.random() * 6000 - 1500;
      onPnlChange(formatSignedRupees(delta), delta >= 0);
    }, HERO_TICK_INTERVAL_MS);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);

  return <canvas ref={ref} width={480} height={220} />;
}

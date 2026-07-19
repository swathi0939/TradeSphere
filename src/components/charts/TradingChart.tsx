import { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { hashString, randomBetween, seededRandom } from '@/services/mockUtils';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
}

interface TradingChartProps {
  symbol: string;
  basePrice: number;
  height?: number;
  onPriceUpdate?: (price: number, up: boolean) => void;
  className?: string;
}

const CANDLE_COUNT = 48;
const TICK_MS = 2000;

function seedCandles(symbol: string, basePrice: number): Candle[] {
  const rng = seededRandom(hashString(symbol));
  const candles: Candle[] = [];
  let price = basePrice * 0.97;
  for (let i = 0; i < CANDLE_COUNT; i++) {
    const open = price;
    const close = open * (1 + randomBetween(rng, -0.008, 0.009));
    const high = Math.max(open, close) * (1 + Math.abs(randomBetween(rng, 0, 0.004)));
    const low = Math.min(open, close) * (1 - Math.abs(randomBetween(rng, 0, 0.004)));
    candles.push({ open, close, high, low });
    price = close;
  }
  return candles;
}

/** Larger candlestick chart for the trading screen, with live-tick simulation per symbol. */
export function TradingChart({ symbol, basePrice, height = 420, onPriceUpdate, className }: TradingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const candlesRef = useRef<Candle[]>(seedCandles(symbol, basePrice));
  const { theme } = useThemeContext();

  useEffect(() => {
    candlesRef.current = seedCandles(symbol, basePrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

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

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas || width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const candles = candlesRef.current;
    const styles = getComputedStyle(document.documentElement);
    const upColor = styles.getPropertyValue('--primary').trim() || '#00C896';
    const downColor = styles.getPropertyValue('--danger').trim() || '#FF4D4F';
    const gridColor = styles.getPropertyValue('--border').trim() || 'rgba(255,255,255,.1)';

    ctx.clearRect(0, 0, width, height);

    const allVals = candles.flatMap((c) => [c.high, c.low]);
    const min = Math.min(...allVals);
    const max = Math.max(...allVals);
    const range = max - min || 1;
    const padding = 16;
    const slot = width / candles.length;
    const bodyW = Math.max(slot * 0.6, 2);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + ((height - padding * 2) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const yFor = (v: number) => height - padding - ((v - min) / range) * (height - padding * 2);

    candles.forEach((c, i) => {
      const x = i * slot + slot / 2;
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
  }, [width, height, theme, symbol]);

  useEffect(() => {
    const id = setInterval(() => {
      const candles = candlesRef.current;
      const last = candles[candles.length - 1];
      if (!last) return;
      const open = last.close;
      const close = open * (1 + randomBetween(Math.random, -0.006, 0.007));
      const high = Math.max(open, close) * 1.002;
      const low = Math.min(open, close) * 0.998;
      const next = [...candles.slice(1), { open, close, high, low }];
      candlesRef.current = next;
      draw();
      onPriceUpdate?.(close, close >= open);
    }, TICK_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, width, height]);

  return (
    <div ref={containerRef} className={className} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

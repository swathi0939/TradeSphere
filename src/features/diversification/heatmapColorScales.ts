const DANGER_RGB = '255,77,79';
const PRIMARY_RGB = '0,200,150';

/** -1..1 diverging scale (red -> gray -> green) matching this app's `--danger`/`--primary` tokens. */
export function divergingColorScale(value: number): string {
  const intensity = Math.min(Math.abs(value), 1);
  const rgb = value < 0 ? DANGER_RGB : PRIMARY_RGB;
  return `rgba(${rgb},${intensity.toFixed(2)})`;
}

/** 0..max single-hue intensity ramp for "how much" framing (e.g. sector exposure %). */
export function sequentialColorScale(value: number, max: number): string {
  const intensity = max <= 0 ? 0 : Math.min(Math.max(value / max, 0), 1);
  return `rgba(${PRIMARY_RGB},${(0.12 + intensity * 0.78).toFixed(2)})`;
}

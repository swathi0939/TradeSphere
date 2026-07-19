/** Period-over-period % returns between consecutive values in `series`. */
export function computeReturns(series: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1]!;
    const curr = series[i]!;
    if (prev === 0) continue;
    returns.push(((curr - prev) / prev) * 100);
  }
  return returns;
}

export function computeStdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/** Pearson correlation coefficient, -1..1. Series are truncated to the shorter length. */
export function computeCorrelation(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  if (length < 2) return 0;

  const aSlice = a.slice(0, length);
  const bSlice = b.slice(0, length);
  const meanA = aSlice.reduce((sum, v) => sum + v, 0) / length;
  const meanB = bSlice.reduce((sum, v) => sum + v, 0) / length;

  let covariance = 0;
  let varianceA = 0;
  let varianceB = 0;
  for (let i = 0; i < length; i++) {
    const diffA = aSlice[i]! - meanA;
    const diffB = bSlice[i]! - meanB;
    covariance += diffA * diffB;
    varianceA += diffA * diffA;
    varianceB += diffB * diffB;
  }

  const denominator = Math.sqrt(varianceA * varianceB);
  if (denominator === 0) return 0;
  return covariance / denominator;
}

const TRADING_DAYS_PER_YEAR = 252;

/** Rolling standard deviation of returns over `windowSize` periods, annualized —
 * same "Annualized" framing `aiService.getRiskMetrics().volatility` already uses. */
export function computeRollingVolatility(values: number[], windowSize: number): number[] {
  const returns = computeReturns(values);
  const rolling: number[] = [];
  for (let i = windowSize; i <= returns.length; i++) {
    const window = returns.slice(i - windowSize, i);
    rolling.push(computeStdDev(window) * Math.sqrt(TRADING_DAYS_PER_YEAR));
  }
  return rolling;
}

/** Running-peak-based drawdown % at each point (0 at/above the running peak, negative below it). */
export function computeDrawdownSeries(values: number[]): number[] {
  let peak = values[0] ?? 0;
  return values.map((v) => {
    peak = Math.max(peak, v);
    return peak === 0 ? 0 : ((v - peak) / peak) * 100;
  });
}

/** Historical VaR via the percentile method — the loss threshold not expected to
 * be exceeded `confidence` of the time (e.g. 0.95 -> 95% historical VaR). */
export function computeHistoricalVaR(returns: number[], confidence: number): number {
  if (returns.length === 0) return 0;
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  return sorted[Math.min(index, sorted.length - 1)]!;
}

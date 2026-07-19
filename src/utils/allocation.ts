import { clamp } from './helpers';
import type { SectorAllocation } from '@/types/portfolio';

export interface AllocationTarget {
  sector: string;
  targetPercent: number;
}

/** Equal-weight-across-held-sectors heuristic, capped at `maxPerSector` with
 * overflow redistributed proportionally to the uncapped sectors — a simple,
 * deterministic reference an investor could reasonably aim for. */
export function computeIdealAllocation(sectors: { sector: string; value: number }[], maxPerSector = 30): AllocationTarget[] {
  const count = sectors.length;
  if (count === 0) return [];

  const equalShare = 100 / count;
  const capped = new Map<string, number>();
  const uncapped: string[] = [];
  let overflow = 0;

  for (const s of sectors) {
    if (equalShare > maxPerSector) {
      capped.set(s.sector, maxPerSector);
      overflow += equalShare - maxPerSector;
    } else {
      uncapped.push(s.sector);
    }
  }

  const uncappedShare = uncapped.length > 0 ? equalShare + overflow / uncapped.length : 0;

  return sectors.map((s) => ({
    sector: s.sector,
    targetPercent: Number((capped.get(s.sector) ?? uncappedShare).toFixed(1)),
  }));
}

export interface RebalanceActionLike {
  sector: string;
  currentPercent: number;
  targetPercent: number;
  currentValue: number;
  deltaValue: number;
  action: 'BUY' | 'SELL' | 'HOLD';
}

const HOLD_EPSILON_VALUE = 500; // deltas smaller than this (in rupees) read as "on target"

/** Per-sector buy/sell deltas needed to move from `current` toward `targets`. */
export function computeRebalanceActions(current: SectorAllocation[], targets: AllocationTarget[], totalValue: number): RebalanceActionLike[] {
  const targetBySector = new Map(targets.map((t) => [t.sector, t.targetPercent]));

  return current.map((c) => {
    const targetPercent = targetBySector.get(c.sector) ?? c.percent;
    const deltaValue = Number(((targetPercent / 100) * totalValue - c.value).toFixed(2));
    const action: RebalanceActionLike['action'] = deltaValue > HOLD_EPSILON_VALUE ? 'BUY' : deltaValue < -HOLD_EPSILON_VALUE ? 'SELL' : 'HOLD';

    return {
      sector: c.sector,
      currentPercent: c.percent,
      targetPercent,
      currentValue: c.value,
      deltaValue,
      action,
    };
  });
}

/** 100 minus a penalty scaled by total absolute deviation from target — same
 * spirit as `portfolioDoctorService.ts`'s health-score math. */
export function computeRebalanceScore(actions: RebalanceActionLike[]): number {
  const totalDeviationPercent = actions.reduce((sum, a) => sum + Math.abs(a.currentPercent - a.targetPercent), 0);
  return Math.round(clamp(100 - totalDeviationPercent * 1.5, 0, 100));
}

import * as portfolioService from '@/services/portfolioService';
import { computeIdealAllocation, computeRebalanceActions, computeRebalanceScore } from '@/utils/allocation';
import { delay } from './mockUtils';
import type { RebalancePlan, RebalanceTarget } from '@/types/rebalancer';

/** Computes a real rebalance plan from actual sector allocation/portfolio value —
 * `targets` defaults to an equal-weight ideal allocation when the caller hasn't
 * picked custom sliders yet. */
export async function getRebalancePlan(targets?: RebalanceTarget[]): Promise<RebalancePlan> {
  const [allocation, summary] = await Promise.all([portfolioService.getSectorAllocation(), portfolioService.getPortfolioSummary()]);

  const resolvedTargets = targets ?? computeIdealAllocation(allocation.map((a) => ({ sector: a.sector, value: a.value })));
  const actions = computeRebalanceActions(allocation, resolvedTargets, summary.totalValue);

  const totalBuyValue = actions.filter((a) => a.action === 'BUY').reduce((sum, a) => sum + a.deltaValue, 0);
  const totalSellValue = Math.abs(actions.filter((a) => a.action === 'SELL').reduce((sum, a) => sum + a.deltaValue, 0));
  const rebalanceScore = computeRebalanceScore(actions);

  return delay({
    totalValue: summary.totalValue,
    actions,
    totalBuyValue,
    totalSellValue,
    rebalanceScore,
  });
}

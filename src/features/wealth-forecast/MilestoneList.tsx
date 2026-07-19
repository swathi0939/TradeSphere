import { Trophy } from 'lucide-react';
import { formatCurrency } from '@/services/mockUtils';
import type { WealthMilestone } from '@/types/wealthForecast';

interface MilestoneListProps {
  milestones: WealthMilestone[];
}

/**
 * Positive/informational-tone list of projected net-worth milestones (mirrors
 * `ConcentrationWarnings`'s row styling) — always primary-tinted since these
 * are achievements to look forward to, never a warning state.
 */
export function MilestoneList({ milestones }: MilestoneListProps) {
  if (milestones.length === 0) {
    return <p className="text-[0.82rem] text-muted">No milestones projected within this scenario's 30-year growth curve.</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {milestones.map((milestone) => (
        <li
          key={milestone.value}
          className="flex items-start gap-2 rounded-md border border-primary/30 bg-[rgba(var(--primary-rgb),0.08)] px-3 py-2 text-[0.82rem] text-primary-text"
        >
          <Trophy size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            {formatCurrency(milestone.value)} by {milestone.year}
          </span>
        </li>
      ))}
    </ul>
  );
}

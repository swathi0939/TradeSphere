import { ShieldAlert, ShieldCheck } from 'lucide-react';
import type { SectorConcentration } from '@/types/portfolioDoctor';

interface ConcentrationWarningsProps {
  warnings: SectorConcentration[];
}

/**
 * Danger-bordered boxes for over-concentrated sectors (mirrors AIInsightsPage's
 * concentrationWarning box styling), or a primary-tinted positive state when
 * there are none. Uses the WCAG-AA-safe `text-danger-text`/`text-primary-text`
 * token variants rather than raw `text-danger`/`text-primary`.
 */
export function ConcentrationWarnings({ warnings }: ConcentrationWarningsProps) {
  if (warnings.length === 0) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-[rgba(var(--primary-rgb),0.08)] px-3 py-2 text-[0.82rem] text-primary-text">
        <ShieldCheck size={15} className="mt-0.5 shrink-0" aria-hidden />
        No sector concentration issues detected — your holdings are spread within healthy limits.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {warnings.map((w) => (
        <li
          key={w.sector}
          className="flex items-start gap-2 rounded-md border border-danger/30 bg-[rgba(255,77,79,0.08)] px-3 py-2 text-[0.82rem] text-danger-text"
        >
          <ShieldAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold">{w.sector}</span> is {w.percent.toFixed(0)}% of your portfolio — above the recommended 30%
            concentration limit.
          </span>
        </li>
      ))}
    </ul>
  );
}

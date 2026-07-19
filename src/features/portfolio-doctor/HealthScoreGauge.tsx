import { Badge } from '@/components/Badge';
import type { PortfolioDiagnosis } from '@/types/portfolioDoctor';

interface HealthScoreGaugeProps {
  score: number;
  grade: PortfolioDiagnosis['grade'];
  diversificationScore: number;
}

const GRADE_BADGE_VARIANT: Record<PortfolioDiagnosis['grade'], 'solid' | 'outline-primary' | 'outline-accent'> = {
  A: 'solid',
  B: 'outline-primary',
  C: 'outline-primary',
  D: 'outline-accent',
  F: 'outline-accent',
};

/** Prominent health-score display with a letter-grade badge and a gradient progress bar, matching AIInsightsPage's sentiment-score pattern. */
export function HealthScoreGauge({ score, grade, diversificationScore }: HealthScoreGaugeProps) {
  return (
    <div>
      <div className="flex items-end gap-3">
        <p className="tabular-figures text-[2.4rem] font-extrabold text-text">{score}</p>
        <span className="mb-2 text-[0.82rem] text-muted">/ 100 health score</span>
        <Badge variant={GRADE_BADGE_VARIANT[grade]} className="mb-2 ml-auto text-[0.9rem]">
          Grade {grade}
        </Badge>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--danger),#f5c542,var(--primary))]"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-3 text-[0.82rem] text-muted">
        Diversification score: <span className="font-semibold text-text">{diversificationScore}/100</span>
      </p>
    </div>
  );
}

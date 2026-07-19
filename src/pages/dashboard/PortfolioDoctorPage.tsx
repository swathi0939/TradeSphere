import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Card } from '@/components/Card';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { AsyncError } from '@/components/ui/AsyncError';
import { DonutChart } from '@/components/charts/DonutChart';
import { HealthScoreGauge } from '@/features/portfolio-doctor/HealthScoreGauge';
import { ConcentrationWarnings } from '@/features/portfolio-doctor/ConcentrationWarnings';
import { usePortfolioDiagnosis } from '@/store/usePortfolioDoctor';
import { ROUTES } from '@/constants/routes';

export default function PortfolioDoctorPage() {
  const { data: diagnosis, isLoading, error, refetch } = usePortfolioDiagnosis();

  return (
    <div>
      <PageHeader
        title="Portfolio Doctor"
        subtitle="A real-time diagnosis of your portfolio's health, computed from your actual holdings."
      />

      <Card glass className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Stethoscope size={18} className="text-primary" aria-hidden />
          <h3 className="text-[0.95rem] font-bold text-text">Overall Diagnosis</h3>
        </div>
        {error ? (
          <AsyncError message={error} onRetry={refetch} />
        ) : isLoading || !diagnosis ? (
          <SkeletonText lines={3} />
        ) : (
          <HealthScoreGauge score={diagnosis.healthScore} grade={diagnosis.grade} diversificationScore={diagnosis.diversificationScore} />
        )}
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartWrapper title="Sector Breakdown" subtitle="Current allocation by sector">
          {error ? (
            <AsyncError message={error} onRetry={refetch} />
          ) : isLoading || !diagnosis ? (
            <SkeletonText lines={5} />
          ) : (
            <DonutChart
              data={diagnosis.sectorBreakdown.map((s) => ({ label: s.sector, value: s.value, percent: s.percent, color: s.color }))}
              centerValue={String(diagnosis.sectorBreakdown.length)}
              centerLabel="Sectors"
            />
          )}
        </ChartWrapper>

        <ChartWrapper title="Concentration Warnings" subtitle="Sectors exceeding the 30% concentration limit">
          {error ? (
            <AsyncError message={error} onRetry={refetch} />
          ) : isLoading || !diagnosis ? (
            <SkeletonText lines={4} />
          ) : (
            <>
              <ConcentrationWarnings warnings={diagnosis.concentrationWarnings} />
              <Link to={ROUTES.rebalancer} className="mt-3 inline-block text-[0.8rem] font-semibold text-primary-text hover:underline">
                Rebalance my portfolio →
              </Link>
            </>
          )}
        </ChartWrapper>
      </div>

      <ChartWrapper title="Suggestions" subtitle="Actionable steps to improve portfolio health" className="mt-6">
        {error ? (
          <AsyncError message={error} onRetry={refetch} />
        ) : isLoading || !diagnosis ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5 text-[0.85rem] text-muted">
            {diagnosis.suggestions.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-primary-text">•</span>
                {s}
              </li>
            ))}
          </ul>
        )}
      </ChartWrapper>
    </div>
  );
}

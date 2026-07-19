import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { StatCard } from '@/components/ui/StatCard';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { ConcentrationWarnings } from '@/features/portfolio-doctor/ConcentrationWarnings';
import { HeatmapGrid } from '@/features/diversification/HeatmapGrid';
import { divergingColorScale, sequentialColorScale } from '@/features/diversification/heatmapColorScales';
import { useDiversification } from '@/store/useDiversification';

const SECTOR_EXPOSURE_MAX_PERCENT = 40;

export default function DiversificationPage() {
  const { data, isLoading } = useDiversification();

  const mostConcentratedSector =
    data && data.sectorExposure.length > 0
      ? data.sectorExposure.reduce((max, s) => (s.percent > max.percent ? s : max), data.sectorExposure[0]!)
      : undefined;

  return (
    <div>
      <PageHeader
        title="Diversification & Correlation"
        subtitle="How your holdings move together, and where your exposure concentrates."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {isLoading || !data ? (
          Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Diversification Score" value={`${data.diversificationScore}/100`} />
            <StatCard label="Sectors Held" value={String(data.sectorExposure.length)} />
            <StatCard
              label="Most Concentrated Sector"
              value={mostConcentratedSector ? `${mostConcentratedSector.sector} (${mostConcentratedSector.percent.toFixed(0)}%)` : '—'}
            />
          </>
        )}
      </div>

      <ChartWrapper title="Correlation Matrix" subtitle="How your top holdings move relative to each other" className="mt-6">
        {isLoading || !data ? (
          <SkeletonText lines={5} />
        ) : (
          <div className="overflow-x-auto">
            <HeatmapGrid
              rowLabels={data.correlationMatrix.symbols}
              colLabels={data.correlationMatrix.symbols}
              values={data.correlationMatrix.values}
              colorScale={divergingColorScale}
            />
          </div>
        )}
      </ChartWrapper>

      <ChartWrapper title="Sector Exposure Heatmap" subtitle="Allocation intensity by sector" className="mt-6">
        {isLoading || !data ? (
          <SkeletonText lines={5} />
        ) : (
          <div className="overflow-x-auto">
            <HeatmapGrid
              rowLabels={data.sectorExposure.map((s) => s.sector)}
              colLabels={['Exposure']}
              values={data.sectorExposure.map((s) => [s.percent])}
              colorScale={(v) => sequentialColorScale(v, SECTOR_EXPOSURE_MAX_PERCENT)}
            />
          </div>
        )}
      </ChartWrapper>

      <ChartWrapper title="Concentration Warnings" className="mt-6">
        {isLoading || !data ? <SkeletonText lines={4} /> : <ConcentrationWarnings warnings={data.concentrationWarnings} />}
      </ChartWrapper>
    </div>
  );
}

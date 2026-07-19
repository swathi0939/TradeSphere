import { Link } from 'react-router-dom';
import { Sparkles, ShieldAlert, HeartPulse, Newspaper } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { useAIInsights, useMarketSentiment, usePortfolioHealth, usePricePredictions } from '@/store/useAIInsights';
import { useNews } from '@/store/useNews';
import { formatCurrency } from '@/services/mockUtils';
import { cn } from '@/utils/helpers';
import { ROUTES } from '@/constants/routes';
import type { InsightAction } from '@/types';

const ACTION_VARIANT: Record<InsightAction, 'solid' | 'outline-primary' | 'outline-accent'> = {
  BUY: 'solid',
  SELL: 'outline-accent',
  HOLD: 'outline-accent',
};

export default function AIInsightsPage() {
  const { data: insights, isLoading: insightsLoading } = useAIInsights(6);
  const { data: sentiment, isLoading: sentimentLoading } = useMarketSentiment();
  const { data: health, isLoading: healthLoading } = usePortfolioHealth();
  const { data: predictions, isLoading: predictionsLoading } = usePricePredictions(5);
  const { data: news, isLoading: newsLoading } = useNews(5);

  const buyCount = insights?.filter((i) => i.action === 'BUY').length ?? 0;
  const sellCount = insights?.filter((i) => i.action === 'SELL').length ?? 0;

  return (
    <div>
      <PageHeader title="AI Insights" subtitle="Model-driven signals across sentiment, risk, and recommendations." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card glass className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-primary" aria-hidden />
            <h3 className="text-[0.95rem] font-bold text-text">Market Sentiment</h3>
          </div>
          {sentimentLoading || !sentiment ? (
            <SkeletonText lines={3} />
          ) : (
            <>
              <div className="flex items-end gap-3">
                <p className="tabular-figures text-[2rem] font-extrabold text-text">{sentiment.score}</p>
                <Badge variant="outline-primary" className="mb-2">
                  {sentiment.label}
                </Badge>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--danger),#f5c542,var(--primary))]"
                  style={{ width: `${sentiment.score}%` }}
                />
              </div>
              <p className="mt-3 text-[0.85rem] text-muted">{sentiment.summary}</p>
              <p className="mt-2 text-[0.78rem] text-muted">Fear &amp; Greed Index: {sentiment.fearGreedIndex}/100</p>
            </>
          )}
        </Card>

        <Card glass className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <HeartPulse size={18} className="text-primary" aria-hidden />
            <h3 className="text-[0.95rem] font-bold text-text">Portfolio Health</h3>
          </div>
          {healthLoading || !health ? (
            <SkeletonText lines={4} />
          ) : (
            <>
              <div className="flex items-end gap-3">
                <p className="tabular-figures text-[2rem] font-extrabold text-text">{health.score}</p>
                <span className="mb-2 text-[0.82rem] text-muted">/ 100 health score</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[0.82rem]">
                <div className="rounded-md bg-surface-2 px-3 py-2">
                  <p className="text-muted">Diversification</p>
                  <p className="font-bold text-text">{health.diversificationScore}/100</p>
                </div>
                <div className="rounded-md bg-surface-2 px-3 py-2">
                  <p className="text-muted">Risk Score</p>
                  <p className="font-bold text-text">{health.riskScore}/100</p>
                </div>
              </div>
              {health.concentrationWarning && (
                <p className="mt-3 flex items-start gap-2 rounded-md border border-danger/30 bg-[rgba(255,77,79,0.08)] px-3 py-2 text-[0.8rem] text-danger-text">
                  <ShieldAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
                  {health.concentrationWarning}
                </p>
              )}
              <ul className="mt-3 flex flex-col gap-2 text-[0.82rem] text-muted">
                {health.suggestions.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="text-primary-text">•</span>
                    {s}
                  </li>
                ))}
              </ul>
              <Link to={ROUTES.portfolioDoctor} className="mt-3 inline-block text-[0.8rem] font-semibold text-primary-text hover:underline">
                View full diagnosis →
              </Link>
              <Link to={ROUTES.aiTimeline} className="mt-1 block text-[0.8rem] font-semibold text-primary-text hover:underline">
                View AI Timeline →
              </Link>
            </>
          )}
        </Card>
      </div>

      <ChartWrapper title="AI Recommendations" subtitle={`${buyCount} Buy · ${sellCount} Sell signals`} className="mt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {insightsLoading || !insights
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : insights.map((insight) => (
                <div key={insight.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-text">{insight.symbol}</p>
                      <p className="text-[0.76rem] text-muted">{insight.name}</p>
                    </div>
                    <Badge variant={ACTION_VARIANT[insight.action]} active className="text-[0.68rem]">
                      {insight.action}
                    </Badge>
                  </div>
                  <p className="mt-2.5 text-[0.8rem] text-muted">{insight.reason}</p>
                  <div className="mt-3 flex items-center justify-between text-[0.8rem]">
                    <span className="text-muted">
                      Target: <span className="font-semibold text-text">{formatCurrency(insight.targetPrice)}</span>
                    </span>
                    <span className="font-semibold text-primary-text">{insight.confidence}% confidence</span>
                  </div>
                </div>
              ))}
        </div>
      </ChartWrapper>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartWrapper title="Price Predictions" subtitle="30-day model forecast">
          <div className="flex flex-col gap-3">
            {predictionsLoading || !predictions
              ? Array.from({ length: 5 }, (_, i) => <SkeletonText key={i} lines={1} />)
              : predictions.map((p) => {
                  const isUp = p.predictedChangePercent >= 0;
                  return (
                    <div key={p.symbol} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-semibold text-text">{p.symbol}</p>
                        <p className="text-[0.76rem] text-muted">
                          {formatCurrency(p.currentPrice)} → {formatCurrency(p.predictedPrice)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={cn('tabular-figures font-semibold', isUp ? 'text-primary-text' : 'text-danger-text')}>
                          {isUp ? '+' : ''}
                          {p.predictedChangePercent.toFixed(2)}%
                        </p>
                        <p className="text-[0.74rem] text-muted">{p.confidence}% confidence</p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </ChartWrapper>

        <ChartWrapper
          title="News Summary"
          subtitle="AI-tagged market sentiment"
          actions={<Newspaper size={16} className="text-muted" aria-hidden />}
        >
          <div className="flex flex-col gap-3">
            {newsLoading || !news
              ? Array.from({ length: 5 }, (_, i) => <SkeletonText key={i} lines={2} />)
              : news.map((item) => (
                  <div key={item.id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[0.85rem] font-semibold text-text">{item.headline}</p>
                      <Badge
                        variant={
                          item.sentiment === 'positive'
                            ? 'outline-primary'
                            : item.sentiment === 'negative'
                              ? 'outline-accent'
                              : 'outline-accent'
                        }
                        active
                        className="shrink-0 text-[0.65rem]"
                      >
                        {item.sentiment}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[0.76rem] text-muted">{item.source}</p>
                  </div>
                ))}
          </div>
        </ChartWrapper>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { SearchBar } from '@/components/ui/SearchBar';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { SkeletonText } from '@/components/ui/Skeleton';
import { DonutChart } from '@/components/charts/DonutChart';
import { useNewsIntelligence } from '@/store/useNewsIntelligence';

const SENTIMENT_COLORS = {
  positive: '#00C896',
  negative: '#FF4D4F',
  neutral: '#8B949E',
};

export default function NewsIntelligencePage() {
  const { data, isLoading } = useNewsIntelligence(20);
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) => item.headline.toLowerCase().includes(q) || item.relatedSymbols.some((symbol) => symbol.toLowerCase().includes(q)),
    );
  }, [data, query]);

  const sentimentSlices = useMemo(() => {
    if (!data) return [];
    const { positive, negative, neutral } = data.sentimentBreakdown;
    const total = positive + negative + neutral;
    if (total === 0) return [];
    return [
      { label: 'Positive', value: positive, percent: (positive / total) * 100, color: SENTIMENT_COLORS.positive },
      { label: 'Negative', value: negative, percent: (negative / total) * 100, color: SENTIMENT_COLORS.negative },
      { label: 'Neutral', value: neutral, percent: (neutral / total) * 100, color: SENTIMENT_COLORS.neutral },
    ];
  }, [data]);

  return (
    <div>
      <PageHeader title="AI News Intelligence" subtitle="Sentiment, trending topics, and company-specific coverage across the market." />

      <Card glass className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-primary" aria-hidden />
          <h3 className="text-[0.95rem] font-bold text-text">AI Digest</h3>
        </div>
        {isLoading || !data ? <SkeletonText lines={3} /> : <p className="text-[0.85rem] text-muted">{data.digest}</p>}
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartWrapper title="Sentiment Breakdown">
          {isLoading || !data ? (
            <SkeletonText lines={5} />
          ) : (
            <DonutChart data={sentimentSlices} centerValue={String(data.items.length)} centerLabel="Stories" />
          )}
        </ChartWrapper>

        <ChartWrapper title="Trending Topics">
          {isLoading || !data ? (
            <SkeletonText lines={5} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.trendingTopics.map((topic) => (
                <span key={topic.symbol} className="rounded-full border border-border px-3 py-1.5 text-[0.8rem] text-text">
                  {topic.symbol} · {topic.mentionCount}
                </span>
              ))}
            </div>
          )}
        </ChartWrapper>
      </div>

      <div className="mt-6">
        <SearchBar value={query} onChange={setQuery} placeholder="Search headline or symbol…" className="sm:w-64" />
      </div>

      <ChartWrapper title="Latest Coverage" className="mt-6">
        <div className="flex flex-col gap-3">
          {isLoading || !data
            ? Array.from({ length: 5 }, (_, i) => <SkeletonText key={i} lines={2} />)
            : filteredItems.length === 0
              ? <p className="py-6 text-center text-muted">No stories match your search.</p>
              : filteredItems.map((item) => (
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
  );
}

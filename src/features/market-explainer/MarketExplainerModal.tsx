import { Modal } from '@/components/ui/Modal';
import { SkeletonText } from '@/components/ui/Skeleton';
import { useMarketExplanation } from '@/store/useMarketExplainer';

interface MarketExplainerModalProps {
  symbol: string;
  name: string;
  open: boolean;
  onClose: () => void;
}

/** On-demand modal explaining why a stock moved, backed by mock sector/news data. */
export function MarketExplainerModal({ symbol, name, open, onClose }: MarketExplainerModalProps) {
  const { data: explanation, isLoading } = useMarketExplanation(symbol, open);

  return (
    <Modal open={open} onClose={onClose} title={`Why is ${name} moving?`}>
      {isLoading ? (
        <SkeletonText lines={4} />
      ) : !explanation ? (
        <p className="text-[0.9rem] text-muted">No data available for this symbol.</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-[0.9rem] leading-relaxed text-primary-text">{explanation.narrative}</p>

          <div>
            <p className="mb-2 text-[0.78rem] font-semibold uppercase tracking-wide text-muted">Related news</p>
            {explanation.relatedNews.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {explanation.relatedNews.map((item) => (
                  <li key={item.id} className="rounded-md border border-border bg-surface-2 p-3">
                    <p className="text-[0.85rem] font-semibold text-text">{item.headline}</p>
                    <p className="mt-1 text-[0.75rem] text-muted">{item.source}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[0.85rem] text-muted">No related news found for {symbol}.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

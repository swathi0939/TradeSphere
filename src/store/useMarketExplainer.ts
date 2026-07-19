import { useEffect, useState } from 'react';
import { explainMove } from '@/services/marketExplainerService';
import type { MarketMoveExplanation } from '@/types/marketExplainer';

/**
 * Intentionally NOT built on the generic useAsync hook — that fetches on
 * mount unconditionally, which would fire a redundant request per
 * MarketCard in a grid (there can be 4-20+ on one page) even when its
 * explainer was never opened. This hook only fetches once `enabled`
 * becomes true (i.e. when the modal is actually opened).
 */
export function useMarketExplanation(symbol: string, enabled: boolean) {
  const [data, setData] = useState<MarketMoveExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-open effect, not fetch-on-mount; gated on `enabled` becoming true
    setIsLoading(true);
    explainMove(symbol)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [symbol, enabled]);

  return { data, isLoading, error };
}

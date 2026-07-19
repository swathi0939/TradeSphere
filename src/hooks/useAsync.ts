import { useCallback, useEffect, useRef, useState } from 'react';
import type { AsyncState } from '@/types';

/**
 * Generic async data-fetching hook backing the domain hooks in `store/`.
 * Runs `fetcher` on mount (and whenever `deps` change), tracks
 * loading/error state, and guards against setting state after unmount.
 *
 * `deps` is an intentionally dynamic passthrough (the same shape as
 * `useEffect`'s own dependency array) since this hook mirrors that API
 * for arbitrary callers — the eslint-disable below is for the one rule
 * that can't be satisfied by a generic hook of this shape.
 */
export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, isLoading: true, error: null });
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/use-memo -- `deps` is a
     dynamic passthrough array by design (mirrors useEffect's own API for callers),
     which this rule can't statically verify for a generic hook of this shape. */
  const run = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    fetcherRef
      .current()
      .then((data) => {
        if (mountedRef.current) setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (mountedRef.current) {
          setState({ data: null, isLoading: false, error: err instanceof Error ? err.message : 'Something went wrong.' });
        }
      });
  }, deps);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/use-memo */

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}

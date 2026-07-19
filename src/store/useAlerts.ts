import { useCallback, useEffect, useState } from 'react';
import * as alertsService from '@/services/alertsService';
import type { AlertDirection, PortfolioAlert, PortfolioAlertMetric, PriceAlert } from '@/types/alerts';

export function useAlerts() {
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [portfolioAlerts, setPortfolioAlerts] = useState<PortfolioAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    Promise.all([alertsService.getPriceAlerts(), alertsService.getPortfolioAlerts()])
      .then(([price, portfolio]) => {
        setPriceAlerts(price);
        setPortfolioAlerts(portfolio);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // Fetch-on-mount: synchronizing with the (mock) alerts service, the
    // textbook case for an Effect rather than derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const createPriceAlert = useCallback(async (symbol: string, targetPrice: number, direction: AlertDirection) => {
    const updated = await alertsService.createPriceAlert(symbol, targetPrice, direction);
    setPriceAlerts(updated);
  }, []);

  const deletePriceAlert = useCallback(async (id: string) => {
    const updated = await alertsService.deletePriceAlert(id);
    setPriceAlerts(updated);
  }, []);

  const createPortfolioAlert = useCallback(async (metric: PortfolioAlertMetric, threshold: number, direction: AlertDirection) => {
    const updated = await alertsService.createPortfolioAlert(metric, threshold, direction);
    setPortfolioAlerts(updated);
  }, []);

  const deletePortfolioAlert = useCallback(async (id: string) => {
    const updated = await alertsService.deletePortfolioAlert(id);
    setPortfolioAlerts(updated);
  }, []);

  return {
    priceAlerts,
    portfolioAlerts,
    isLoading,
    createPriceAlert,
    deletePriceAlert,
    createPortfolioAlert,
    deletePortfolioAlert,
    refetch: load,
  };
}

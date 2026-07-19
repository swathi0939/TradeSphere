import type { AlertDirection, PortfolioAlert, PortfolioAlertMetric, PriceAlert } from '@/types/alerts';
import type { PortfolioSummary, Stock } from '@/types';
import { delay, generateId } from './mockUtils';

const PRICE_ALERTS_KEY = 'tradesphere-price-alerts';
const PORTFOLIO_ALERTS_KEY = 'tradesphere-portfolio-alerts';

function readPriceAlerts(): PriceAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PRICE_ALERTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PriceAlert[]) : [];
  } catch {
    return [];
  }
}

function writePriceAlerts(alerts: PriceAlert[]) {
  window.localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));
}

function readPortfolioAlerts(): PortfolioAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PORTFOLIO_ALERTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PortfolioAlert[]) : [];
  } catch {
    return [];
  }
}

function writePortfolioAlerts(alerts: PortfolioAlert[]) {
  window.localStorage.setItem(PORTFOLIO_ALERTS_KEY, JSON.stringify(alerts));
}

export async function getPriceAlerts(): Promise<PriceAlert[]> {
  return delay(readPriceAlerts());
}

export async function createPriceAlert(symbol: string, targetPrice: number, direction: AlertDirection): Promise<PriceAlert[]> {
  const alerts = readPriceAlerts();
  alerts.push({ id: generateId('pa'), symbol, targetPrice, direction, createdAt: new Date().toISOString(), triggered: false });
  writePriceAlerts(alerts);
  return delay(alerts, 150);
}

export async function deletePriceAlert(id: string): Promise<PriceAlert[]> {
  const alerts = readPriceAlerts().filter((a) => a.id !== id);
  writePriceAlerts(alerts);
  return delay(alerts, 150);
}

export async function getPortfolioAlerts(): Promise<PortfolioAlert[]> {
  return delay(readPortfolioAlerts());
}

export async function createPortfolioAlert(metric: PortfolioAlertMetric, threshold: number, direction: AlertDirection): Promise<PortfolioAlert[]> {
  const alerts = readPortfolioAlerts();
  alerts.push({ id: generateId('pfa'), metric, threshold, direction, createdAt: new Date().toISOString(), triggered: false });
  writePortfolioAlerts(alerts);
  return delay(alerts, 150);
}

export async function deletePortfolioAlert(id: string): Promise<PortfolioAlert[]> {
  const alerts = readPortfolioAlerts().filter((a) => a.id !== id);
  writePortfolioAlerts(alerts);
  return delay(alerts, 150);
}

function isTriggered(direction: AlertDirection, value: number, threshold: number): boolean {
  return direction === 'above' ? value >= threshold : value <= threshold;
}

/** Pure recompute of `triggered` state against live data — called on initial
 * load and from a periodic recheck, never touches storage. */
export function evaluateAlerts(
  priceAlerts: PriceAlert[],
  stocks: Stock[],
  portfolioAlerts: PortfolioAlert[],
  summary: PortfolioSummary,
): { triggeredPriceAlerts: PriceAlert[]; triggeredPortfolioAlerts: PortfolioAlert[] } {
  const triggeredPriceAlerts = priceAlerts.map((alert) => {
    const stock = stocks.find((s) => s.symbol === alert.symbol);
    const triggered = stock ? isTriggered(alert.direction, stock.price, alert.targetPrice) : false;
    return { ...alert, triggered };
  });

  const triggeredPortfolioAlerts = portfolioAlerts.map((alert) => {
    const value = alert.metric === 'totalValue' ? summary.totalValue : summary.todayPnlPercent;
    return { ...alert, triggered: isTriggered(alert.direction, value, alert.threshold) };
  });

  return { triggeredPriceAlerts, triggeredPortfolioAlerts };
}

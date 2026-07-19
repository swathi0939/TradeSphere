import * as portfolioService from '@/services/portfolioService';
import * as dailyBriefService from '@/services/dailyBriefService';
import * as portfolioDoctorService from '@/services/portfolioDoctorService';
import * as wealthForecastService from '@/services/wealthForecastService';
import * as stressTestingService from '@/services/stressTestingService';
import { delay, generateId } from './mockUtils';
import type { PortfolioSnapshot, SavedReport, SavedReportType } from '@/types';

const SNAPSHOTS_STORAGE_KEY = 'tradesphere-portfolio-snapshots';
const REPORTS_STORAGE_KEY = 'tradesphere-saved-reports';

function readSnapshots(): PortfolioSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PortfolioSnapshot[]) : [];
  } catch {
    return [];
  }
}

function writeSnapshots(snapshots: PortfolioSnapshot[]) {
  window.localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(snapshots));
}

function readReports(): SavedReport[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedReport[]) : [];
  } catch {
    return [];
  }
}

function writeReports(reports: SavedReport[]) {
  window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
}

export async function getPortfolioSnapshots(): Promise<PortfolioSnapshot[]> {
  return delay(readSnapshots(), 250);
}

export async function savePortfolioSnapshot(name: string): Promise<PortfolioSnapshot[]> {
  const [summary, holdings] = await Promise.all([portfolioService.getPortfolioSummary(), portfolioService.getHoldings()]);
  const snapshots = readSnapshots();
  snapshots.push({
    id: generateId('snap'),
    name,
    createdAt: new Date().toISOString(),
    totalValue: summary.totalValue,
    totalInvested: summary.totalInvested,
    holdingsCount: holdings.length,
  });
  writeSnapshots(snapshots);
  return delay(snapshots, 300);
}

export async function deletePortfolioSnapshot(id: string): Promise<PortfolioSnapshot[]> {
  const snapshots = readSnapshots().filter((s) => s.id !== id);
  writeSnapshots(snapshots);
  return delay(snapshots, 200);
}

async function buildReportContent(type: SavedReportType): Promise<{ title: string; content: string }> {
  switch (type) {
    case 'dailyBrief': {
      const result = await dailyBriefService.getDailyBrief();
      return { title: `Daily Brief — ${new Date().toLocaleDateString('en-IN')}`, content: result.summary };
    }
    case 'portfolioDiagnosis': {
      const result = await portfolioDoctorService.getPortfolioDiagnosis();
      return { title: `Portfolio Diagnosis — Grade ${result.grade}`, content: result.suggestions.join(' ') };
    }
    case 'wealthForecast': {
      const result = await wealthForecastService.getWealthForecast();
      return { title: `Wealth Forecast — ${result.label} Scenario`, content: result.narrative };
    }
    case 'stressTest': {
      const result = await stressTestingService.runStressTest('bear');
      return { title: `Stress Test — ${result.label} Scenario`, content: result.aiSummary };
    }
    default: {
      const exhaustiveCheck: never = type;
      throw new Error(`Unknown saved report type: ${String(exhaustiveCheck)}`);
    }
  }
}

export async function getSavedReports(): Promise<SavedReport[]> {
  return delay(readReports(), 250);
}

export async function saveReport(type: SavedReportType): Promise<SavedReport[]> {
  const { title, content } = await buildReportContent(type);
  const reports = readReports();
  reports.push({ id: generateId('report'), type, title, content, createdAt: new Date().toISOString() });
  writeReports(reports);
  return delay(reports, 300);
}

export async function deleteReport(id: string): Promise<SavedReport[]> {
  const reports = readReports().filter((r) => r.id !== id);
  writeReports(reports);
  return delay(reports, 200);
}

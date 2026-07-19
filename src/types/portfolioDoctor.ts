import type { SectorAllocation } from './portfolio';

export interface SectorConcentration {
  sector: string;
  percent: number;
  isOverConcentrated: boolean; // true if percent > 30
}

export interface PortfolioDiagnosis {
  healthScore: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  diversificationScore: number; // 0-100
  concentrationWarnings: SectorConcentration[];
  suggestions: string[];
  sectorBreakdown: SectorAllocation[];
}

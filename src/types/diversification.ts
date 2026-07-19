import type { SectorConcentration } from './portfolioDoctor';

export type SectorRiskLevel = 'low' | 'medium' | 'high';

export interface SectorExposure {
  sector: string;
  percent: number;
  riskLevel: SectorRiskLevel;
}

export interface CorrelationMatrix {
  symbols: string[];
  values: number[][];
}

export interface DiversificationAnalysis {
  correlationMatrix: CorrelationMatrix;
  diversificationScore: number;
  concentrationWarnings: SectorConcentration[];
  sectorExposure: SectorExposure[];
}

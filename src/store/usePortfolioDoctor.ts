import { useAsync } from '@/hooks/useAsync';
import { getPortfolioDiagnosis } from '@/services/portfolioDoctorService';

export function usePortfolioDiagnosis() {
  return useAsync(getPortfolioDiagnosis, []);
}

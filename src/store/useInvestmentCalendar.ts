import { useAsync } from '@/hooks/useAsync';
import { getCalendarEvents } from '@/services/investmentCalendarService';

export function useInvestmentCalendar(month: number, year: number) {
  return useAsync(() => getCalendarEvents(month, year), [month, year]);
}

import * as portfolioService from '@/services/portfolioService';
import * as aiService from '@/services/aiService';
import { delay, hashString, randomInt, seededRandom } from './mockUtils';
import type { CalendarEvent } from '@/types/investmentCalendar';

const HOLIDAYS: { label: string; month: number; day: number }[] = [
  { label: "New Year's Day", month: 0, day: 1 },
  { label: 'Republic Day', month: 0, day: 26 },
  { label: 'Independence Day', month: 7, day: 15 },
  { label: 'Gandhi Jayanti', month: 9, day: 2 },
  { label: 'Diwali (Market Holiday)', month: 10, day: 1 },
];

function buildISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export async function getCalendarEvents(month: number, year: number): Promise<CalendarEvent[]> {
  const [holdings, insights] = await Promise.all([portfolioService.getHoldings(), aiService.getAIInsights(8)]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const holdingEvents: CalendarEvent[] = holdings.flatMap((holding) => {
    const earningsRng = seededRandom(hashString(`${holding.symbol}-earnings-${year}-${month}`));
    const earningsDay = randomInt(earningsRng, 1, daysInMonth);
    const dividendRng = seededRandom(hashString(`${holding.symbol}-dividend-${year}-${month}`));
    const dividendDay = randomInt(dividendRng, 1, daysInMonth);

    return [
      {
        id: `cal-earnings-${holding.symbol}-${year}-${month}`,
        date: buildISODate(year, month, earningsDay),
        type: 'earnings',
        title: `${holding.symbol} Earnings Report`,
        description: `Quarterly results expected for ${holding.name}.`,
        symbol: holding.symbol,
      },
      {
        id: `cal-dividend-${holding.symbol}-${year}-${month}`,
        date: buildISODate(year, month, dividendDay),
        type: 'dividend',
        title: `${holding.symbol} Dividend Date`,
        description: `Potential dividend distribution for ${holding.name}.`,
        symbol: holding.symbol,
      },
    ];
  });

  const reviewEvents: CalendarEvent[] = insights.map((insight) => {
    const rng = seededRandom(hashString(`${insight.id}-review-${year}-${month}`));
    const day = randomInt(rng, 1, daysInMonth);

    return {
      id: `cal-review-${insight.id}`,
      date: buildISODate(year, month, day),
      type: 'review',
      title: `Reassess ${insight.symbol}`,
      description: `AI flagged ${insight.symbol} as a ${insight.action} — ${insight.reason}`,
      symbol: insight.symbol,
    };
  });

  const holidayEvents: CalendarEvent[] = HOLIDAYS.filter((h) => h.month === month).map((h) => ({
    id: `cal-holiday-${h.label}-${year}`,
    date: buildISODate(year, h.month, h.day),
    type: 'holiday',
    title: h.label,
    description: 'Markets closed.',
  }));

  const events = [...holdingEvents, ...reviewEvents, ...holidayEvents].sort((a, b) => a.date.localeCompare(b.date));

  return delay(events);
}

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';
import { CalendarGrid } from '@/features/investment-calendar/CalendarGrid';
import { useInvestmentCalendar } from '@/store/useInvestmentCalendar';

const LEGEND_ITEMS = [
  { label: 'Earnings', dotClassName: 'bg-primary' },
  { label: 'Dividend', dotClassName: 'bg-accent' },
  { label: 'Review', dotClassName: 'bg-accent' },
  { label: 'Holiday', dotClassName: 'bg-danger' },
];

export default function InvestmentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const { data: events, isLoading } = useInvestmentCalendar(month, year);

  const goToPreviousMonth = () => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <div>
      <PageHeader
        title="AI Investment Calendar"
        subtitle="Earnings, dividends, AI review reminders, and market holidays for your holdings."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth} aria-label="Previous month">
              <ChevronLeft size={16} aria-hidden />
            </Button>
            <span className="min-w-[9rem] text-center text-[0.88rem] font-semibold text-text">
              {currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="sm" onClick={goToNextMonth} aria-label="Next month">
              <ChevronRight size={16} aria-hidden />
            </Button>
          </>
        }
      />

      <Card glass className="p-5">
        {isLoading || !events ? (
          <div className="flex flex-col gap-4">
            <SkeletonText lines={2} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : (
          <CalendarGrid month={month} year={year} events={events} />
        )}
      </Card>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        {LEGEND_ITEMS.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 text-[0.78rem] text-muted">
            <span className={`h-2 w-2 rounded-full ${item.dotClassName}`} aria-hidden />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

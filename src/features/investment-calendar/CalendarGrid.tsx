import { cn } from '@/utils/helpers';
import type { CalendarEvent, CalendarEventType } from '@/types/investmentCalendar';

interface CalendarGridProps {
  month: number;
  year: number;
  events: CalendarEvent[];
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TONE_STYLES: Record<CalendarEventType, string> = {
  earnings: 'bg-[rgba(var(--primary-rgb),0.1)] text-primary-text',
  dividend: 'bg-[rgba(var(--accent-rgb),0.1)] text-accent-text',
  review: 'bg-[rgba(var(--accent-rgb),0.1)] text-accent-text',
  holiday: 'bg-[rgba(255,77,79,0.1)] text-danger-text',
};

const MAX_VISIBLE_EVENTS = 2;

export function CalendarGrid({ month, year, events }: CalendarGridProps) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDay = new Map<number, CalendarEvent[]>();
  events.forEach((event) => {
    const day = Number(event.date.slice(8, 10));
    const dayEvents = eventsByDay.get(day) ?? [];
    dayEvents.push(event);
    eventsByDay.set(day, dayEvents);
  });

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAY_LABELS.map((label) => (
        <div key={label} className="px-1 pb-1 text-[0.72rem] font-semibold text-muted">
          {label}
        </div>
      ))}

      {Array.from({ length: firstWeekday }, (_, i) => (
        <div key={`empty-${i}`} className="min-h-[86px]" />
      ))}

      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dayEvents = eventsByDay.get(day) ?? [];
        const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
        const extraCount = dayEvents.length - visibleEvents.length;
        const isToday = isCurrentMonth && today.getDate() === day;

        return (
          <div
            key={day}
            className={cn('min-h-[86px] rounded-md border border-border p-1.5', isToday && 'border-primary')}
          >
            <p className="text-[0.78rem] font-semibold text-text">{day}</p>
            <div className="mt-1 flex flex-col gap-1">
              {visibleEvents.map((event) => (
                <span
                  key={event.id}
                  className={cn('truncate rounded-full px-1.5 py-0.5 text-[0.66rem] font-medium', TONE_STYLES[event.type])}
                  title={event.title}
                >
                  {event.title}
                </span>
              ))}
              {extraCount > 0 && <span className="text-[0.66rem] text-muted">+{extraCount} more</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

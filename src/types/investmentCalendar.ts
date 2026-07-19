export type CalendarEventType = 'earnings' | 'dividend' | 'review' | 'holiday';

export interface CalendarEvent {
  id: string;
  date: string;
  type: CalendarEventType;
  title: string;
  description: string;
  symbol?: string;
}

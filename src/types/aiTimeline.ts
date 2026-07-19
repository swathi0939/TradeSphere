export type TimelineEventType = 'insight' | 'trade' | 'milestone' | 'news';
export type TimelineEventTone = 'positive' | 'negative' | 'neutral';

export interface TimelineEvent {
  id: string;
  date: string;
  type: TimelineEventType;
  title: string;
  description: string;
  tone: TimelineEventTone;
}

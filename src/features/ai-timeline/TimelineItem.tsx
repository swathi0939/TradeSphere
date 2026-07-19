import { memo } from 'react';
import { Sparkles, Repeat, Newspaper, TrendingUp, TrendingDown } from 'lucide-react';
import type { TimelineEvent, TimelineEventTone } from '@/types';
import { cn } from '@/utils/helpers';

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

const TONE_STYLES: Record<TimelineEventTone, string> = {
  positive: 'bg-[rgba(var(--primary-rgb),0.1)] text-primary-text',
  negative: 'bg-[rgba(255,77,79,0.1)] text-danger-text',
  neutral: 'bg-[rgba(var(--accent-rgb),0.1)] text-accent-text',
};

function renderIcon(event: TimelineEvent) {
  if (event.type === 'insight') return <Sparkles size={16} aria-hidden />;
  if (event.type === 'trade') return <Repeat size={16} aria-hidden />;
  if (event.type === 'news') return <Newspaper size={16} aria-hidden />;
  return event.tone === 'negative' ? <TrendingDown size={16} aria-hidden /> : <TrendingUp size={16} aria-hidden />;
}

/** One row of the AI Timeline's vertical feed — icon-in-circle (tinted by tone)
 * with a connecting line down to the next item, plus date/title/description.
 * Memoized — rendered dozens-deep in a list that rarely changes per row. */
export const TimelineItem = memo(function TimelineItem({ event, isLast }: TimelineItemProps) {
  const date = new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="relative flex gap-4">
      <div className="relative shrink-0">
        <div className={cn('grid h-9 w-9 place-items-center rounded-full', TONE_STYLES[event.tone])}>{renderIcon(event)}</div>
        {!isLast && <div className="absolute top-9 bottom-[-24px] left-[17px] w-px bg-border" />}
      </div>
      <div className="pb-6">
        <p className="text-[0.74rem] text-muted">{date}</p>
        <p className="text-[0.88rem] font-semibold text-text">{event.title}</p>
        <p className="mt-1 text-[0.8rem] text-muted">{event.description}</p>
      </div>
    </div>
  );
});

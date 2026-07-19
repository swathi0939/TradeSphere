import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/Card';
import { SkeletonText } from '@/components/ui/Skeleton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TimelineItem } from '@/features/ai-timeline/TimelineItem';
import { useAITimeline } from '@/store/useAITimeline';

const DAY_RANGE_OPTIONS = [
  { value: '30', label: '30 Days' },
  { value: '45', label: '45 Days' },
  { value: '90', label: '90 Days' },
];

export default function AITimelinePage() {
  const [days, setDays] = useState('45');
  const { data, isLoading } = useAITimeline(Number(days));

  return (
    <div>
      <PageHeader
        title="AI Timeline"
        subtitle="A unified, chronological view of AI insights, trades, and market moves affecting your portfolio."
        actions={<SegmentedControl options={DAY_RANGE_OPTIONS} value={days} onChange={setDays} label="Timeline range" />}
      />

      <Card glass className="p-5">
        {isLoading || !data ? (
          <SkeletonText lines={6} />
        ) : data.length === 0 ? (
          <p className="py-8 text-center text-muted">No timeline activity in the selected range yet.</p>
        ) : (
          <ul>
            {data.map((event, i) => (
              <li key={event.id}>
                <TimelineItem event={event} isLast={i === data.length - 1} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

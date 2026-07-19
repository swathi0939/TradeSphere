import { Sparkles } from 'lucide-react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { SkeletonText } from '@/components/ui/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useDailyBrief } from '@/store/useDailyBrief';
import { cn } from '@/utils/helpers';
import type { DailyBriefHighlight } from '@/types/dailyBrief';

interface DailyBriefCardProps {
  className?: string;
}

/** Maps a highlight's semantic tone to a Badge variant + active state, mirroring
 * the `ACTION_VARIANT` pattern in `AIInsightsPage.tsx` (BUY/SELL/HOLD -> Badge). */
function toneBadgeProps(tone: DailyBriefHighlight['tone']): { variant: 'solid' | 'outline-primary' | 'outline-accent'; active: boolean } {
  switch (tone) {
    case 'positive':
      return { variant: 'outline-primary', active: true };
    case 'negative':
      return { variant: 'outline-accent', active: true };
    default:
      return { variant: 'outline-accent', active: false };
  }
}

/** Narrative daily summary card for the top of the Dashboard Overview page. */
export function DailyBriefCard({ className }: DailyBriefCardProps) {
  const { user } = useAuth();
  const { data: brief, isLoading } = useDailyBrief(user?.fullName);

  return (
    <Card glass spotlight className={cn('mb-6 p-5 md:p-6', className)}>
      {isLoading || !brief ? (
        <SkeletonText lines={3} />
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary-text" aria-hidden />
            <h2 className="text-[1.05rem] font-bold text-text">{brief.greeting}</h2>
          </div>
          <p className="mt-2 text-[0.9rem] text-muted">{brief.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {brief.highlights.map((highlight) => {
              const { variant, active } = toneBadgeProps(highlight.tone);
              return (
                <Badge key={highlight.label} variant={variant} active={active} className="text-[0.72rem]">
                  {highlight.label}: {highlight.value}
                </Badge>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}

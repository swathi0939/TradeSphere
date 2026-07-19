import { memo } from 'react';
import { Bell, ChartCandlestick, Newspaper, Sparkles, Wallet } from 'lucide-react';
import type { AppNotification, NotificationCategory } from '@/types';
import { cn } from '@/utils/helpers';

const CATEGORY_ICON: Record<NotificationCategory, typeof Bell> = {
  trade: ChartCandlestick,
  market: Bell,
  ai: Sparkles,
  news: Newspaper,
  portfolio: Wallet,
};

const CATEGORY_COLOR: Record<NotificationCategory, string> = {
  trade: 'text-primary bg-[rgba(var(--primary-rgb),0.12)]',
  market: 'text-accent bg-[rgba(var(--accent-rgb),0.12)]',
  ai: 'text-[#a855f7] bg-[rgba(168,85,247,0.12)]',
  news: 'text-[#f5c542] bg-[rgba(245,197,66,0.12)]',
  portfolio: 'text-primary bg-[rgba(var(--primary-rgb),0.12)]',
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface NotificationCardProps {
  notification: AppNotification;
  onClick?: (notification: AppNotification) => void;
}

/** Memoized — rendered in lists of many, re-rendered by parent state
 * (tab switches, mark-all-read) that doesn't necessarily change this row. */
export const NotificationCard = memo(function NotificationCard({ notification, onClick }: NotificationCardProps) {
  const Icon = CATEGORY_ICON[notification.category];

  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className={cn(
        'flex w-full items-start gap-3 rounded-md p-3.5 text-left transition-colors hover:bg-surface-2',
        !notification.read && 'bg-[rgba(var(--primary-rgb),0.04)]',
      )}
    >
      <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full', CATEGORY_COLOR[notification.category])}>
        <Icon size={16} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[0.87rem] font-semibold text-text">{notification.title}</p>
          {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />}
        </div>
        <p className="mt-0.5 line-clamp-2 text-[0.82rem] text-muted">{notification.message}</p>
        <p className="mt-1 text-[0.74rem] text-muted">{formatRelativeTime(notification.timestamp)}</p>
      </div>
    </button>
  );
});

import { useMemo, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { useNotifications } from '@/contexts/NotificationsContext';
import { cn } from '@/utils/helpers';
import type { NotificationCategory } from '@/types';

type Tab = 'all' | NotificationCategory;

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'trade', label: 'Trade Alerts' },
  { key: 'market', label: 'Market Alerts' },
  { key: 'ai', label: 'AI Alerts' },
  { key: 'news', label: 'News Alerts' },
  { key: 'portfolio', label: 'Portfolio Alerts' },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState<Tab>('all');
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  const filtered = useMemo(() => (tab === 'all' ? notifications : notifications.filter((n) => n.category === tab)), [notifications, tab]);

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.` : 'You are all caught up.'}
        actions={
          <Button variant="ghost" size="sm" onClick={() => void markAllAsRead()}>
            <CheckCheck size={15} aria-hidden />
            Mark all read
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold transition-colors',
              tab === t.key ? 'bg-primary text-[#04140f]' : 'border border-border text-muted hover:text-text',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card glass className="p-2">
        {isLoading ? (
          <p className="p-6 text-center text-muted">Loading notifications…</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-muted">No notifications in this category.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((n) => (
              <NotificationCard key={n.id} notification={n} onClick={(item) => void markAsRead(item.id)} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

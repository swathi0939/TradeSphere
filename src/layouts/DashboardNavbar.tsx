import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Plus, User, Settings, LogOut, CheckCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/ui/SearchBar';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/helpers';

interface DashboardNavbarProps {
  onMobileMenuToggle: () => void;
}

/** Dashboard top bar — mobile menu toggle, search, notifications, theme toggle, quick actions, avatar menu. */
export function DashboardNavbar({ onMobileMenuToggle }: DashboardNavbarProps) {
  const [query, setQuery] = useState('');
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.login);
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] px-4 py-3 backdrop-blur-md lg:px-6">
      <button type="button" onClick={onMobileMenuToggle} aria-label="Toggle sidebar" className="text-text lg:hidden">
        <Menu size={22} aria-hidden />
      </button>

      <SearchBar value={query} onChange={setQuery} placeholder="Search stocks, orders, insights…" className="max-w-md flex-1" />

      <div className="ml-auto flex items-center gap-2">
        <Button href={ROUTES.trading} variant="primary" size="sm" className="hidden sm:inline-flex">
          <Plus size={16} aria-hidden />
          Quick Trade
        </Button>

        <Dropdown
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
              className="relative grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-text"
            >
              <Bell size={17} aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[0.62rem] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
          panelClassName="w-[340px] p-0 overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-border p-3">
            <p className="text-[0.9rem] font-bold text-text">Notifications</p>
            <button type="button" onClick={() => void markAllAsRead()} className="flex items-center gap-1 text-[0.76rem] font-medium text-primary-text hover:opacity-80">
              <CheckCheck size={13} aria-hidden />
              Mark all read
            </button>
          </div>
          <div className="max-h-[340px] overflow-y-auto p-1.5">
            {notifications.slice(0, 6).map((n) => (
              <NotificationCard key={n.id} notification={n} onClick={(item) => void markAsRead(item.id)} />
            ))}
          </div>
          <a href={ROUTES.notifications} className="block border-t border-border p-2.5 text-center text-[0.8rem] font-semibold text-primary-text hover:opacity-80">
            View all notifications
          </a>
        </Dropdown>

        <ThemeToggle />

        <Dropdown
          trigger={({ toggle }) => (
            <button type="button" onClick={toggle} aria-label="Account menu" className="flex items-center gap-2 rounded-full">
              <Avatar name={user?.fullName ?? 'User'} size="sm" />
            </button>
          )}
        >
          {user && (
            <div className={cn('mb-1 border-b border-border px-3 py-2')}>
              <p className="truncate text-[0.85rem] font-semibold text-text">{user.fullName}</p>
              <p className="truncate text-[0.75rem] text-muted">{user.email}</p>
            </div>
          )}
          <DropdownItem icon={<User size={15} aria-hidden />} onClick={() => navigate(ROUTES.profile)}>
            Profile
          </DropdownItem>
          <DropdownItem icon={<Settings size={15} aria-hidden />} onClick={() => navigate(ROUTES.settings)}>
            Settings
          </DropdownItem>
          <DropdownItem icon={<LogOut size={15} aria-hidden />} danger onClick={() => void handleLogout()}>
            Logout
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}

import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { LogoMark } from '@/components/LogoMark';
import { Avatar } from '@/components/ui/Avatar';
import { SIDEBAR_NAV, SIDEBAR_NAV_SECONDARY } from '@/constants/nav';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/helpers';

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarLink({ item, onClick }: { item: (typeof SIDEBAR_NAV)[number]; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.href}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.88rem] font-medium transition-colors duration-200',
          isActive ? 'bg-[rgba(var(--primary-rgb),0.12)] text-primary-text' : 'text-muted hover:bg-surface-2 hover:text-text',
        )
      }
    >
      <Icon size={18} aria-hidden />
      {item.label}
    </NavLink>
  );
}

/** Dashboard sidebar — fixed on desktop, off-canvas drawer on mobile/tablet. */
export function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const { user, logout } = useAuth();

  const content = (
    <div className="flex h-full flex-col">
      <a href="/" className="flex items-center gap-2.5 px-5 py-6 text-[1.1rem] font-extrabold tracking-[-0.02em]">
        <LogoMark size={20} />
        TradeSphere
      </a>

      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {SIDEBAR_NAV.map((item) => (
            <li key={item.href}>
              <SidebarLink item={item} onClick={onMobileClose} />
            </li>
          ))}
        </ul>
        <div className="my-3 border-t border-border" />
        <ul className="flex flex-col gap-1">
          {SIDEBAR_NAV_SECONDARY.map((item) => (
            <li key={item.href}>
              <SidebarLink item={item} onClick={onMobileClose} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        {user && (
          <div className="mb-2 flex items-center gap-2.5 rounded-md px-2 py-2">
            <Avatar name={user.fullName} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[0.82rem] font-semibold text-text">{user.fullName}</p>
              <p className="truncate text-[0.72rem] text-muted">{user.plan} Plan</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[0.88rem] font-medium text-muted transition-colors hover:bg-[rgba(255,77,79,0.1)] hover:text-danger-text"
        >
          <LogOut size={18} aria-hidden />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] border-r border-border bg-surface lg:block">{content}</aside>

      {/* Mobile / tablet drawer */}
      <div
        className={cn('fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden', mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0')}
        onClick={onMobileClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[401] w-[280px] border-r border-border bg-surface transition-transform duration-300 ease-brand lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-hidden={!mobileOpen}
      >
        {content}
      </aside>
    </>
  );
}

import { useState } from 'react';
import { Bell, Globe, Lock, Palette, SlidersHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/utils/helpers';

type SettingsTab = 'appearance' | 'notifications' | 'privacy' | 'security' | 'preferences';

const TABS: { key: SettingsTab; label: string; icon: typeof Bell }[] = [
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'privacy', label: 'Privacy', icon: Globe },
  { key: 'security', label: 'Security', icon: Lock },
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
];

const NOTIF_OPTIONS = [
  { key: 'trade', label: 'Trade execution alerts' },
  { key: 'market', label: 'Market movement alerts' },
  { key: 'ai', label: 'AI insight notifications' },
  { key: 'news', label: 'Breaking news alerts' },
  { key: 'portfolio', label: 'Portfolio milestones' },
];

const PRIVACY_OPTIONS = [
  { key: 'analytics', label: 'Share anonymized usage analytics' },
  { key: 'marketing', label: 'Receive product & marketing emails' },
  { key: 'thirdParty', label: 'Allow third-party data partners' },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('appearance');
  const { theme } = useThemeContext();
  const { showToast } = useToast();
  const [language, setLanguage] = useState('en');
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({ trade: true, market: true, ai: true, news: false, portfolio: true });
  const [privacyPrefs, setPrivacyPrefs] = useState<Record<string, boolean>>({ analytics: true, marketing: false, thirdParty: false });

  function handleSave() {
    showToast('success', 'Settings saved', 'Your preferences have been updated.');
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your account preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[0.86rem] font-medium transition-colors',
                  tab === t.key ? 'bg-[rgba(var(--primary-rgb),0.12)] text-primary-text' : 'text-muted hover:bg-surface-2 hover:text-text',
                )}
              >
                <Icon size={16} aria-hidden />
                {t.label}
              </button>
            );
          })}
        </nav>

        <Card glass className="p-6">
          {tab === 'appearance' && (
            <div>
              <h3 className="mb-4 text-[0.95rem] font-bold text-text">Appearance</h3>
              <div className="flex items-center justify-between rounded-md bg-surface-2 px-4 py-3.5">
                <div>
                  <p className="text-[0.88rem] font-semibold text-text">Theme</p>
                  <p className="text-[0.78rem] text-muted">Currently using {theme === 'dark' ? 'Dark' : 'Light'} mode</p>
                </div>
                <ThemeToggle />
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h3 className="mb-4 text-[0.95rem] font-bold text-text">Notification Preferences</h3>
              <div className="flex flex-col gap-3.5">
                {NOTIF_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt.key}
                    label={opt.label}
                    checked={notifPrefs[opt.key] ?? false}
                    onChange={(e) => setNotifPrefs((prev) => ({ ...prev, [opt.key]: e.target.checked }))}
                    className="text-text"
                  />
                ))}
              </div>
            </div>
          )}

          {tab === 'privacy' && (
            <div>
              <h3 className="mb-4 text-[0.95rem] font-bold text-text">Privacy</h3>
              <div className="flex flex-col gap-3.5">
                {PRIVACY_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt.key}
                    label={opt.label}
                    checked={privacyPrefs[opt.key] ?? false}
                    onChange={(e) => setPrivacyPrefs((prev) => ({ ...prev, [opt.key]: e.target.checked }))}
                    className="text-text"
                  />
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h3 className="mb-4 text-[0.95rem] font-bold text-text">Security</h3>
              <p className="text-[0.85rem] text-muted">
                Manage your password and two-factor authentication from the{' '}
                <a href="/dashboard/profile" className="font-semibold text-primary-text hover:opacity-80">
                  Profile
                </a>{' '}
                page.
              </p>
            </div>
          )}

          {tab === 'preferences' && (
            <div>
              <h3 className="mb-4 text-[0.95rem] font-bold text-text">Preferences</h3>
              <label htmlFor="language-select" className="mb-1.5 block text-[0.85rem] font-medium text-text">
                Language
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full max-w-xs rounded-md border border-border bg-surface px-3.5 py-2.5 text-[0.9rem] text-text focus-visible:border-primary focus-visible:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-[0.9rem] font-semibold text-[#04140f] transition-transform hover:-translate-y-0.5"
          >
            Save Preferences
          </button>
        </Card>
      </div>
    </div>
  );
}

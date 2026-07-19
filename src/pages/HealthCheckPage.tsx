import { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThemeContext } from '@/contexts/ThemeContext';
import { APP_NAME, APP_VERSION, BUILD_TIME } from '@/config/env';
import { cn } from '@/utils/helpers';

interface CheckResult {
  label: string;
  ok: boolean;
  detail: string;
}

function checkLocalStorage(): CheckResult {
  try {
    const key = '__health_check__';
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return { label: 'Local storage', ok: true, detail: 'Read/write succeeded' };
  } catch {
    return { label: 'Local storage', ok: false, detail: 'Unavailable — private browsing mode may block it' };
  }
}

/**
 * A client-side status page — this app has no real backend to probe (every
 * `services/*.ts` module is deterministic mock data), so "health" here means
 * the client environment itself: is the app's own runtime state (storage,
 * connectivity, theme) working as expected. Framed honestly, not as a
 * backend-uptime dashboard this app doesn't have.
 */
export default function HealthCheckPage() {
  const isOnline = useOnlineStatus();
  const { theme } = useThemeContext();

  const checks = useMemo<CheckResult[]>(
    () => [
      checkLocalStorage(),
      { label: 'Network connectivity', ok: isOnline, detail: isOnline ? 'Browser reports online' : 'Browser reports offline' },
      { label: 'Theme system', ok: true, detail: `Active theme: ${theme}` },
    ],
    [isOnline, theme],
  );

  const allOk = checks.every((c) => c.ok);

  return (
    <MarketingLayout>
      <Container className="max-w-2xl py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.4rem] font-extrabold tracking-[-0.02em] text-text">System Status</h1>
            <p className="mt-1 text-[0.88rem] text-muted">
              {APP_NAME} v{APP_VERSION}
            </p>
          </div>
          <Badge variant={allOk ? 'solid' : 'outline-accent'} active>
            {allOk ? 'All systems operational' : 'Degraded'}
          </Badge>
        </div>

        <Card glass className="flex flex-col divide-y divide-border p-0">
          {checks.map((check) => (
            <div key={check.label} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                {check.ok ? (
                  <CheckCircle2 size={18} className="text-primary-text" aria-hidden />
                ) : (
                  <XCircle size={18} className="text-danger-text" aria-hidden />
                )}
                <div>
                  <p className="text-[0.88rem] font-semibold text-text">{check.label}</p>
                  <p className="text-[0.78rem] text-muted">{check.detail}</p>
                </div>
              </div>
              <span className={cn('text-[0.78rem] font-semibold', check.ok ? 'text-primary-text' : 'text-danger-text')}>
                {check.ok ? 'OK' : 'Fail'}
              </span>
            </div>
          ))}
        </Card>

        <p className="mt-6 text-center text-[0.76rem] text-muted">
          Build time: {new Date(BUILD_TIME).toLocaleString('en-IN')}
        </p>
        <p className="mt-1 text-center text-[0.72rem] text-muted">
          TradeSphere is a mock-data demo application — this page reports client-side status only; there is no backend to probe.
        </p>
      </Container>
    </MarketingLayout>
  );
}

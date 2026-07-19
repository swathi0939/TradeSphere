import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

/** Sticky top banner shown only while `navigator.onLine` is false; disappears on its own once back online. */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div role="status" className="flex items-center justify-center gap-2 bg-danger px-4 py-2 text-[0.82rem] font-semibold text-white">
      <WifiOff size={14} aria-hidden />
      You're offline — some data may be out of date.
    </div>
  );
}

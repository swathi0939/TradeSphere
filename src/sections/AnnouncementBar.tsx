import { useState } from 'react';
import { X } from 'lucide-react';
import { ANNOUNCE_DISMISSED_KEY } from '@/utils/constants';

/** Thin promo bar above the nav, dismissible for the session. */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && window.sessionStorage.getItem(ANNOUNCE_DISMISSED_KEY) === '1',
  );

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    window.sessionStorage.setItem(ANNOUNCE_DISMISSED_KEY, '1');
  }

  return (
    <div className="relative bg-[linear-gradient(90deg,var(--secondary),#123059)] px-[44px] py-[10px] pl-4 text-center text-[0.85rem] text-white">
      <p>
        <span aria-hidden="true">🚀</span> TradeSphere now supports BSE F&amp;O trading —{' '}
        <a href="#pricing" className="ml-1 font-semibold text-primary transition-opacity duration-200 hover:opacity-80">
          Explore Pro
        </a>
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute top-1/2 right-[10px] -translate-y-1/2 p-1 text-white opacity-70 transition-opacity duration-200 hover:opacity-100"
      >
        <X size={18} aria-hidden />
      </button>
    </div>
  );
}

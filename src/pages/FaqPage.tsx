import { MarketingLayout } from '@/layouts/MarketingLayout';
import { FAQ } from '@/sections/FAQ';

/** `sections/FAQ.tsx` already brings its own eyebrow/heading ("QUESTIONS" /
 * "Frequently asked questions") and section padding — reused verbatim, with
 * no separate intro heading layered on top (that read as a redundant
 * double heading during Phase 6 verification). */
export default function FaqPage() {
  return (
    <MarketingLayout>
      <FAQ />
    </MarketingLayout>
  );
}

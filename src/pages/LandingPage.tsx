import { useEffect, useState } from 'react';
import { Loader } from '@/components/Loader';
import { BackToTop } from '@/components/BackToTop';
import { AnnouncementBar } from '@/sections/AnnouncementBar';
import { Navbar } from '@/sections/Navbar';
import { Hero } from '@/sections/Hero';
import { TrustStrip } from '@/sections/TrustStrip';
import { HowItWorks } from '@/sections/HowItWorks';
import { DashboardPreview } from '@/sections/DashboardPreview';
import { Features } from '@/sections/Features';
import { LiveCharts } from '@/sections/LiveCharts';
import { Security } from '@/sections/Security';
import { Pricing } from '@/sections/Pricing';
import { Testimonials } from '@/sections/Testimonials';
import { Roadmap } from '@/sections/Roadmap';
import { FAQ } from '@/sections/FAQ';
import { CTA } from '@/sections/CTA';
import { Footer } from '@/sections/Footer';
import { useScroll } from '@/hooks/useScroll';
import { getPrefersReducedMotion } from '@/utils/helpers';
import { LOADER_HIDE_DELAY_MS, NAV_LINKS } from '@/utils/constants';

const NAV_HREFS = NAV_LINKS.map((l) => l.href);

/**
 * The original marketing site, unchanged. Kept as its own page component
 * so it can be mounted at "/" alongside the authenticated SaaS app's
 * routes without any modification to its structure or behavior.
 */
export default function LandingPage() {
  const [loaderVisible, setLoaderVisible] = useState(true);
  const { scrolled, showBackToTop, activeHref } = useScroll(NAV_HREFS);

  useEffect(() => {
    const delay = getPrefersReducedMotion() ? 0 : LOADER_HIDE_DELAY_MS;
    const timer = setTimeout(() => setLoaderVisible(false), delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Loader visible={loaderVisible} />

      <a
        href="#main-content"
        className="fixed top-[-60px] left-3 z-[1000] rounded-sm bg-primary px-4 py-[10px] font-bold text-[#04140f] transition-[top] duration-200 ease-brand focus:top-3"
      >
        Skip to main content
      </a>

      <AnnouncementBar />
      <Navbar scrolled={scrolled} activeHref={activeHref} />

      <main id="main-content">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <DashboardPreview />
        <Features />
        <LiveCharts />
        <Security />
        <Pricing />
        <Testimonials />
        <Roadmap />
        <FAQ />
        <CTA />
      </main>

      <Footer />
      <BackToTop visible={showBackToTop} />
    </>
  );
}

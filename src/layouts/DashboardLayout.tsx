import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNavbar } from './DashboardNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { CopilotProvider } from '@/contexts/CopilotContext';
import { CopilotFab } from '@/features/copilot/CopilotFab';
import { CopilotDrawer } from '@/features/copilot/CopilotDrawer';
import { OfflineBanner } from '@/components/OfflineBanner';
import { OnboardingTour } from '@/features/onboarding/OnboardingTour';
import { useOnboarding } from '@/store/useOnboarding';
import { ROUTES } from '@/constants/routes';

/** Shell for every authenticated route — sidebar, top bar, animated route transitions. */
export function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isOpen: onboardingOpen, dismiss: dismissOnboarding } = useOnboarding();

  useEffect(() => {
    // Closes the mobile drawer on any route change, including browser
    // back/forward navigation (sidebar link clicks already close it
    // directly, but this covers navigation the sidebar doesn't see).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  return (
    <CopilotProvider>
      <NotificationsProvider>
        <WatchlistProvider>
          <div className="min-h-screen bg-bg">
            <OfflineBanner />
            <DashboardSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
            <div className="lg:pl-[260px]">
              <DashboardNavbar onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)} />
              <main className="p-4 lg:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
            <CopilotFab />
            <CopilotDrawer />
            <OnboardingTour open={onboardingOpen} onDismiss={dismissOnboarding} />
          </div>
        </WatchlistProvider>
      </NotificationsProvider>
    </CopilotProvider>
  );
}

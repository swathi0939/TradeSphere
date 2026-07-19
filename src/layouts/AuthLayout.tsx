import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoMark } from '@/components/LogoMark';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

/** Shell for every auth route — animated dark background, centered glass card, route transitions. */
export function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.overview} replace />;
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 text-[#E6EDF3]"
      style={{
        // The auth background is always dark regardless of the site-wide
        // theme (same design decision as the landing page hero), so the
        // shared Input/Checkbox components' `text-text`/`text-muted`
        // utilities need overriding here. Note: Tailwind's generated
        // `--color-text: var(--text)` is computed once where it's declared
        // (:root) and that resolved value is what descendants inherit —
        // overriding `--text` alone doesn't reach it, so the actual
        // `--color-*` variables the utilities reference are set directly.
        ['--color-text' as string]: '#E6EDF3',
        ['--color-muted' as string]: '#9fb0c9',
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="gradient-mesh" />
        <div className="grid-overlay" />
      </div>

      <div className="relative z-1 w-full max-w-md">
        <a href="/" className="mb-8 flex items-center justify-center gap-2.5 text-[1.2rem] font-extrabold tracking-[-0.02em] text-white">
          <LogoMark size={24} />
          TradeSphere
        </a>

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-lg border-[rgba(255,255,255,0.1)] bg-[rgba(22,27,34,0.55)] p-7 sm:p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        <p className="mt-6 text-center text-[0.8rem] text-muted-on-dark">
          <a href="/" className="hover:text-primary">
            ← Back to homepage
          </a>
        </p>
      </div>
    </div>
  );
}

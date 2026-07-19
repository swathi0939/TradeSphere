import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';

/** Chrome-free shell for printable report/snapshot pages — no sidebar/navbar, forces a paper-like appearance. */
export function PrintLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-white p-8 text-black print:p-0">
      <Outlet />
    </div>
  );
}

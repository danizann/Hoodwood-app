import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, type Role } from '../auth';

export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { isReady, user } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center text-slate-300">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

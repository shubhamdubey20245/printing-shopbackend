import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, currentUser } = useAppStore();
  const location = useLocation();

  if (!token || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

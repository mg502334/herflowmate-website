import { Navigate, Outlet } from 'react-router';
import { useCustomerAuth } from './CustomerAuthContext';

export function CustomerProtectedRoute() {
  const { user, loading } = useCustomerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-[#2C3E50]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

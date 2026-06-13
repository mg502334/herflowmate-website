import { Navigate, Outlet } from "react-router";
import { useAdminAuth } from "./AdminAuthContext";

export function AuthGuard() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

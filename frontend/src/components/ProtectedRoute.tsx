import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";


interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectTo?: string;
  children?: ReactNode; 
}

export const ProtectedRoute = ({
  isAllowed,
  redirectTo = "/login",
  children,
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo}  />;
  }

  return children ? children : <Outlet />;
};
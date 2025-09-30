import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";


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
  const { usuario } = useUser();

  // Si no hay usuario autenticado, siempre ir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario pero no cumple permisos, redirigir a la ruta indicada
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
};
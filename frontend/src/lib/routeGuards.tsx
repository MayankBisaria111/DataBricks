import { Navigate, Outlet } from "react-router-dom";
import { getSession, UserRole } from "../app/auth";

export function RequireAuth() {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

type RequireRoleProps = {
  role: UserRole;
};

export function RequireRole({ role }: RequireRoleProps) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;

  if (session.role !== role) {
    const fallback = session.role === "controller" ? "/controller" : "/passenger";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

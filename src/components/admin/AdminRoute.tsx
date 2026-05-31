import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { hasAdminSession } from "../../lib/adminAuth";

type AdminRouteProps = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    hasAdminSession().then((session) => {
      setAllowed(session);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="admin-dashboard-shell flex min-h-screen items-center justify-center px-6">
        <p className="text-sm font-medium text-muted">Verificando acceso...</p>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

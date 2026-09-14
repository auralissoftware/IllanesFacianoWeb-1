import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasAdminSession } from "../../lib/adminAuth";

type AdminRouteProps = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();
  const initialCheckDone = useRef(false);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    hasAdminSession().then((session) => {
      if (cancelled) {
        return;
      }

      setAllowed(session);

      if (!initialCheckDone.current) {
        initialCheckDone.current = true;
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [location.key]);

  if (!ready) {
    return (
      <div className="admin-dashboard-shell flex min-h-screen items-center justify-center px-6">
        <p className="text-sm font-medium text-muted">Verificando acceso...</p>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

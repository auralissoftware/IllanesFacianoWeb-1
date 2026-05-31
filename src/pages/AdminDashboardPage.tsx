import { AdminDashboard } from "../components/admin/AdminDashboard";
import { AdminRoute } from "../components/admin/AdminRoute";

export function AdminDashboardPage() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
}

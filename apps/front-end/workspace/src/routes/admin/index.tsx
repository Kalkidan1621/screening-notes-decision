import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <p className="admin-dashboard-eyebrow">
          ADMINISTRATION
        </p>

        <h1>Dashboard</h1>

        <p className="admin-dashboard-subtitle">
          Welcome to the Muyalogy recruitment
          administration dashboard.
        </p>
      </div>
    </main>
  );
}
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/applications/"
)({
  component: ApplicationsPage,
});


function ApplicationsPage() {
  return (
    <main>
      <h1>
        Applications List
      </h1>

      <p>
        All candidates will appear here.
      </p>
    </main>
  );
}
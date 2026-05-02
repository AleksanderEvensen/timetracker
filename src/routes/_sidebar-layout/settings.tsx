import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_sidebar-layout/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Settings</div>;
}

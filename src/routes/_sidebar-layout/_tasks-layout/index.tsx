import { createFileRoute } from "@tanstack/react-router";

import { TimeEntriesEmpty } from "#/components/compositions/time-entries-empty";

export const Route = createFileRoute("/_sidebar-layout/_tasks-layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TimeEntriesEmpty />;
}

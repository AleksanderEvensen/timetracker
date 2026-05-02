import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, TrashIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "#/components/ui/empty";
import { ProjectOverview } from "#/components/compositions/project-overview";
import { useProjectsStore } from "#/stores/projects";
import { useSettingsStore } from "#/stores/settings";

export const Route = createFileRoute("/_sidebar-layout/projects/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const project = useProjectsStore((s) => s.projects.find((p) => p.id === id));
  const deleteProject = useProjectsStore((s) => s.deleteProject);
  const currency = useSettingsStore((s) => s.currency);
  const dateFormat = useSettingsStore((s) => s.dateFormat);

  if (!project) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Project not found</EmptyTitle>
            <EmptyDescription>The project you are looking for does not exist.</EmptyDescription>
          </EmptyHeader>
          <Button render={<Link to="/projects" />}>Back to projects</Button>
        </Empty>
      </div>
    );
  }

  const handleDelete = () => {
    deleteProject(project.id);
    navigate({ to: "/projects" });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" render={<Link to="/projects" />}>
          <ArrowLeftIcon /> Back to projects
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <TrashIcon /> Delete project
        </Button>
      </div>

      <ProjectOverview project={project} currency={currency} dateFormat={dateFormat} />

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>All registered tasks for this project.</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No tasks yet</EmptyTitle>
              <EmptyDescription>
                Tracked tasks will appear here once you start logging work.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  );
}

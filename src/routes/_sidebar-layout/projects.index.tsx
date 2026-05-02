import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { CreateProjectCard } from "#/components/compositions/create-project-card";
import { ProjectCard } from "#/components/compositions/project-card";
import {
  ProjectCreateDialog,
  type ProjectFormValues,
} from "#/components/compositions/project-create-dialog";
import { useProjectsStore } from "#/stores/projects";
import { useSettingsStore } from "#/stores/settings";

export const Route = createFileRoute("/_sidebar-layout/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const projects = useProjectsStore((s) => s.projects);
  const currentProjectId = useProjectsStore((s) => s.currentProjectId);
  const setCurrentProject = useProjectsStore((s) => s.setCurrentProject);
  const createProject = useProjectsStore((s) => s.createProject);
  const currency = useSettingsStore((s) => s.currency);
  const dateFormat = useSettingsStore((s) => s.dateFormat);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = (values: ProjectFormValues) => {
    const project = createProject(values);
    setDialogOpen(false);
    navigate({ to: "/projects/$id", params: { id: project.id } });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            startDate={project.startDate}
            hourlyRate={project.hourlyRate}
            hoursWorked={project.hoursWorked}
            currency={currency}
            dateFormat={dateFormat}
            isCurrent={project.id === currentProjectId}
            onEdit={() =>
              navigate({
                to: "/projects/$id",
                params: { id: project.id },
              })
            }
            onSelect={() => setCurrentProject(project.id)}
          />
        ))}
        <CreateProjectCard onClick={() => setDialogOpen(true)} />
      </div>
      <ProjectCreateDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleCreate} />
    </div>
  );
}

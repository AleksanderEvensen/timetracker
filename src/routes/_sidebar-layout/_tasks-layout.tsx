import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "#/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "#/components/ui/empty";
import {
  TaskCreateDialog,
  type TaskFormValues,
} from "#/components/compositions/task-create-dialog";
import { TasksList } from "#/components/compositions/tasks-list";
import { useProjectsStore } from "#/stores/projects";
import { useTasksStore } from "#/stores/tasks";

export const Route = createFileRoute("/_sidebar-layout/_tasks-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const currentProject = useProjectsStore((s) =>
    s.currentProjectId
      ? (s.projects.find((p) => p.id === s.currentProjectId) ?? undefined)
      : undefined,
  );
  const tasks = useTasksStore((s) => s.tasks);
  const addTask = useTasksStore((s) => s.addTask);
  const startTask = useTasksStore((s) => s.startTask);
  const stopTask = useTasksStore((s) => s.stopTask);

  const params = useParams({ strict: false }) as { taskId?: string };
  const selectedTaskId = params.taskId ?? null;

  const navigate = useNavigate();

  const projectTasks = useMemo(
    () =>
      currentProject
        ? tasks.filter((t) => t.projectId === currentProject.id)
        : [],
    [tasks, currentProject],
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  if (!currentProject) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No project selected</EmptyTitle>
            <EmptyDescription>
              Pick or create a project to start tracking tasks.
            </EmptyDescription>
          </EmptyHeader>
          <Button render={<Link to="/projects" />}>Go to projects</Button>
        </Empty>
      </div>
    );
  }

  const goToTask = (taskId: string) => {
    navigate({ to: "/$taskId", params: { taskId } });
  };

  const handleToggleTask = (taskId: string) => {
    const task = projectTasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.runningSince) {
      stopTask(taskId);
    } else {
      startTask(taskId);
    }
    goToTask(taskId);
  };

  const handleCreate = (values: TaskFormValues) => {
    const task = addTask(currentProject.id, values.name.trim());
    setDialogOpen(false);
    goToTask(task.id);
  };

  return (
    <div className="grid flex-1 grid-cols-1 gap-4 p-6 lg:grid-cols-[20rem_1fr]">
      <TasksList
        tasks={projectTasks}
        subtitle={currentProject.name}
        selectedTaskId={selectedTaskId}
        onSelectTask={goToTask}
        onToggleTask={handleToggleTask}
        onAddTask={() => setDialogOpen(true)}
      />
      <Outlet />
      <TaskCreateDialog
        open={dialogOpen}
        projectName={currentProject.name}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />
    </div>
  );
}

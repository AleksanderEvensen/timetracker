import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

import { TimeEntriesEmpty } from "#/components/compositions/time-entries-empty";
import { TimeEntriesPanel } from "#/components/compositions/time-entries-panel";
import type { EntrySubmitValues } from "#/components/compositions/entry-edit-popover";
import { useProjectsStore } from "#/stores/projects";
import { useSettingsStore } from "#/stores/settings";
import { useTasksStore, type EntryUpdate } from "#/stores/tasks";

export const Route = createFileRoute("/_sidebar-layout/_tasks-layout/$taskId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();

  const currentProject = useProjectsStore((s) =>
    s.currentProjectId
      ? (s.projects.find((p) => p.id === s.currentProjectId) ?? undefined)
      : undefined,
  );
  const tasks = useTasksStore((s) => s.tasks);
  const addEntry = useTasksStore((s) => s.addEntry);
  const updateEntry = useTasksStore((s) => s.updateEntry);
  const deleteEntry = useTasksStore((s) => s.deleteEntry);
  const timeFormat = useSettingsStore((s) => s.timeFormat);

  const projectTasks = useMemo(
    () => (currentProject ? tasks.filter((t) => t.projectId === currentProject.id) : []),
    [tasks, currentProject],
  );

  const task = projectTasks.find((t) => t.id === taskId) ?? null;

  if (!task) {
    return (
      <TimeEntriesEmpty
        title="Task not found"
        description="This task does not exist in the current project."
      />
    );
  }

  const handleCreate = (values: EntrySubmitValues) => {
    addEntry(values.taskId, { start: values.start, end: values.end });
    if (values.taskId !== task.id) {
      navigate({ to: "/$taskId", params: { taskId: values.taskId } });
    }
  };

  const handleUpdate = (entryId: string, update: EntryUpdate) => {
    updateEntry(task.id, entryId, update);
    if (update.taskId && update.taskId !== task.id) {
      navigate({ to: "/$taskId", params: { taskId: update.taskId } });
    }
  };

  const handleDelete = (entryId: string) => {
    deleteEntry(task.id, entryId);
  };

  return (
    <TimeEntriesPanel
      task={task}
      timeFormat={timeFormat}
      projectTasks={projectTasks}
      onCreateEntry={handleCreate}
      onUpdateEntry={handleUpdate}
      onDeleteEntry={handleDelete}
    />
  );
}

import { PauseIcon, PlayIcon, PlusIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "#/components/ui/empty";
import { formatDuration } from "#/lib/format";
import { taskTotalSeconds, type Task } from "#/stores/tasks";
import { cn } from "#/lib/utils";

export type TasksListProps = {
  tasks: Task[];
  subtitle?: string;
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: () => void;
};

export function TasksList({
  tasks,
  subtitle,
  selectedTaskId,
  onSelectTask,
  onToggleTask,
  onAddTask,
}: TasksListProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-2 border-b border-border p-3">
        <div className="flex flex-col leading-tight">
          <h2 className="font-heading text-sm font-medium">All tasks</h2>
          <span className="text-[0.625rem] text-muted-foreground">{subtitle ?? " "}</span>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onAddTask} aria-label="Add task">
          <PlusIcon />
        </Button>
      </div>
      {tasks.length === 0 ? (
        <Empty className="border-0">
          <EmptyHeader>
            <EmptyTitle>No tasks yet</EmptyTitle>
            <EmptyDescription>Add a task to start tracking time on this project.</EmptyDescription>
          </EmptyHeader>
          <Button size="sm" onClick={onAddTask}>
            <PlusIcon /> Add task
          </Button>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-0.5 p-2">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskRow
                task={task}
                isSelected={task.id === selectedTaskId}
                onSelect={() => onSelectTask(task.id)}
                onToggle={() => onToggleTask(task.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskRow({
  task,
  isSelected,
  onSelect,
  onToggle,
}: {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const isRunning = task.runningSince != null;
  const totalLabel = formatDuration(taskTotalSeconds(task));

  return (
    <div
      className={cn(
        "group/task flex w-full items-center gap-2 rounded-md pl-1 pr-2 transition-colors",
        "hover:bg-muted/50",
        isSelected && "bg-primary/15 hover:bg-primary/20",
      )}
    >
      <Button
        variant={isRunning ? "destructive" : "ghost"}
        size="icon-sm"
        onClick={onToggle}
        aria-label={isRunning ? "Stop task" : "Start task"}
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <button
        type="button"
        onClick={onSelect}
        className="flex flex-1 items-center gap-2 py-1.5 text-left outline-none focus-visible:underline"
      >
        <span className="flex-1 truncate text-xs/relaxed font-medium">{task.name}</span>
        <span
          className={cn(
            "text-xs/relaxed tabular-nums text-muted-foreground",
            (isRunning || isSelected) && "text-foreground",
          )}
        >
          {totalLabel}
        </span>
      </button>
    </div>
  );
}

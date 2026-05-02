import { format } from "date-fns";
import { PlusIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "#/components/ui/empty";
import {
  EntryEditPopover,
  type EntrySubmitValues,
} from "#/components/compositions/entry-edit-popover";
import {
  formatDuration,
  formatDurationLong,
  formatTime,
} from "#/lib/format";
import {
  entryDurationSeconds,
  type EntryUpdate,
  type Task,
  type TimeEntry,
} from "#/stores/tasks";
import type { TimeFormat } from "#/stores/settings";

export type TimeEntriesPanelProps = {
  task: Task;
  timeFormat: TimeFormat;
  projectTasks: ReadonlyArray<Task>;
  onCreateEntry: (values: EntrySubmitValues) => void;
  onUpdateEntry: (entryId: string, update: EntryUpdate) => void;
  onDeleteEntry: (entryId: string) => void;
};

type DayGroup = {
  key: string;
  date: Date;
  entries: TimeEntry[];
  totalSeconds: number;
};

function groupEntriesByDay(entries: TimeEntry[]): DayGroup[] {
  const map = new Map<string, DayGroup>();
  for (const entry of entries) {
    const start = new Date(entry.start);
    const key = format(start, "yyyy-MM-dd");
    let group = map.get(key);
    if (!group) {
      const dayStart = new Date(start);
      dayStart.setHours(0, 0, 0, 0);
      group = { key, date: dayStart, entries: [], totalSeconds: 0 };
      map.set(key, group);
    }
    group.entries.push(entry);
    group.totalSeconds += entryDurationSeconds(entry);
  }
  for (const group of map.values()) {
    group.entries.sort(
      (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
    );
  }
  return [...map.values()].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
}

export function TimeEntriesPanel({
  task,
  timeFormat,
  projectTasks,
  onCreateEntry,
  onUpdateEntry,
  onDeleteEntry,
}: TimeEntriesPanelProps) {
  const groups = groupEntriesByDay(task.entries);

  return (
    <div className="flex flex-1 flex-col rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-2 border-b border-border p-3">
        <div className="flex flex-col leading-tight">
          <h2 className="font-heading text-sm font-medium">Time Entries</h2>
          <span className="text-[0.625rem] text-muted-foreground">
            {task.name}
          </span>
        </div>
        <EntryEditPopover
          taskId={task.id}
          projectTasks={projectTasks}
          onSubmit={onCreateEntry}
          renderTrigger={
            <Button variant="ghost" size="icon-sm" aria-label="Add entry" />
          }
        >
          <PlusIcon />
        </EntryEditPopover>
      </div>
      {groups.length === 0 ? (
        <Empty className="border-0">
          <EmptyHeader>
            <EmptyTitle>No entries yet</EmptyTitle>
            <EmptyDescription>
              Start the task or add a manual entry to log your first time
              entry.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col">
          {groups.map((group) => (
            <DaySection
              key={group.key}
              group={group}
              taskId={task.id}
              timeFormat={timeFormat}
              projectTasks={projectTasks}
              onUpdateEntry={onUpdateEntry}
              onDeleteEntry={onDeleteEntry}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DaySection({
  group,
  taskId,
  timeFormat,
  projectTasks,
  onUpdateEntry,
  onDeleteEntry,
}: {
  group: DayGroup;
  taskId: string;
  timeFormat: TimeFormat;
  projectTasks: ReadonlyArray<Task>;
  onUpdateEntry: (entryId: string, update: EntryUpdate) => void;
  onDeleteEntry: (entryId: string) => void;
}) {
  return (
    <section className="border-b border-border last:border-b-0">
      <header className="flex items-center justify-between gap-2 px-3 pt-4 pb-2">
        <h3 className="font-heading text-sm font-medium">
          {format(group.date, "EEEE, MMMM d")}
        </h3>
        <span className="text-xs/relaxed tabular-nums text-muted-foreground">
          {formatDuration(group.totalSeconds)}
        </span>
      </header>
      <ul className="flex flex-col">
        {group.entries.map((entry) => (
          <li key={entry.id}>
            <EntryEditPopover
              entry={entry}
              taskId={taskId}
              projectTasks={projectTasks}
              onSubmit={(values) => onUpdateEntry(entry.id, values)}
              onDelete={() => onDeleteEntry(entry.id)}
              triggerClassName="flex w-full items-center gap-3 border-l-2 border-primary/40 px-3 py-2 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:bg-muted aria-expanded:bg-muted"
            >
              <EntryRowContent entry={entry} timeFormat={timeFormat} />
            </EntryEditPopover>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EntryRowContent({
  entry,
  timeFormat,
}: {
  entry: TimeEntry;
  timeFormat: TimeFormat;
}) {
  const start = new Date(entry.start);
  const end = new Date(entry.end);
  return (
    <>
      <div className="flex flex-col text-[0.625rem] leading-tight tabular-nums text-muted-foreground">
        <span>{formatTime(start, timeFormat)}</span>
        <span>{formatTime(end, timeFormat)}</span>
      </div>
      <div className="flex-1" />
      <span className="text-xs/relaxed tabular-nums">
        {formatDurationLong(entryDurationSeconds(entry))}
      </span>
    </>
  );
}

import { useState } from "react";
import { TrashIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/components/ui/popover";
import { formHandlers, useAppForm } from "#/hooks/form";
import type { Task, TimeEntry } from "#/stores/tasks";

export type EntrySubmitValues = {
  taskId: string;
  start: string;
  end: string;
};

export type EntryEditPopoverProps = {
  entry?: TimeEntry;
  taskId: string;
  projectTasks: ReadonlyArray<Task>;
  onSubmit: (values: EntrySubmitValues) => void;
  onDelete?: () => void;
  children: React.ReactNode;
  triggerClassName?: string;
  renderTrigger?: React.ReactElement;
};

function isoToLocalInput(iso: string): string {
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function localInputToIso(local: string): string {
  return new Date(local).toISOString();
}

function defaultStartEnd() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  return {
    start: isoToLocalInput(oneHourAgo.toISOString()),
    end: isoToLocalInput(now.toISOString()),
  };
}

export function EntryEditPopover({
  entry,
  taskId,
  projectTasks,
  onSubmit,
  onDelete,
  children,
  triggerClassName,
  renderTrigger,
}: EntryEditPopoverProps) {
  const [open, setOpen] = useState(false);
  const isEdit = entry != null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={renderTrigger ?? <button type="button" className={triggerClassName} />}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" sideOffset={8} className="w-96">
        <PopoverHeader>
          <PopoverTitle>{isEdit ? "Edit time entry" : "Add time entry"}</PopoverTitle>
          <PopoverDescription>
            {isEdit
              ? "Update times, move it to another task, or delete it."
              : "Log a manual entry for this task."}
          </PopoverDescription>
        </PopoverHeader>
        {open && (
          <EntryForm
            key={entry?.id ?? "new"}
            entry={entry}
            taskId={taskId}
            projectTasks={projectTasks}
            onSubmit={(values) => {
              onSubmit(values);
              setOpen(false);
            }}
            onDelete={
              isEdit && onDelete
                ? () => {
                    onDelete();
                    setOpen(false);
                  }
                : undefined
            }
            onCancel={() => setOpen(false)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

function EntryForm({
  entry,
  taskId,
  projectTasks,
  onSubmit,
  onDelete,
  onCancel,
}: {
  entry?: TimeEntry;
  taskId: string;
  projectTasks: ReadonlyArray<Task>;
  onSubmit: (values: EntrySubmitValues) => void;
  onDelete?: () => void;
  onCancel: () => void;
}) {
  const defaults = entry
    ? {
        taskId,
        start: isoToLocalInput(entry.start),
        end: isoToLocalInput(entry.end),
      }
    : { taskId, ...defaultStartEnd() };

  const form = useAppForm({
    defaultValues: defaults as EntrySubmitValues,
    onSubmit: ({ value }) => {
      onSubmit({
        taskId: value.taskId,
        start: localInputToIso(value.start),
        end: localInputToIso(value.end),
      });
    },
  });

  const taskOptions = projectTasks.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <form {...formHandlers(form)} className="flex flex-col gap-3">
      <form.AppField name="taskId">
        {(field) => (
          <field.SelectField
            label="Task"
            required
            options={taskOptions}
            placeholder="Select task"
          />
        )}
      </form.AppField>

      <form.AppField
        name="start"
        validators={{
          onChange: ({ value }) => (!value ? "Start time is required" : undefined),
        }}
      >
        {(field) => <field.DateTimeField label="Start" required />}
      </form.AppField>

      <form.AppField
        name="end"
        validators={{
          onChange: ({ value, fieldApi }) => {
            if (!value) return "End time is required";
            const start = fieldApi.form.getFieldValue("start");
            if (start && value < start) return "End must be after start";
            return undefined;
          },
        }}
      >
        {(field) => <field.DateTimeField label="End" required />}
      </form.AppField>

      <div className="flex items-center justify-between gap-2 pt-1">
        {onDelete ? (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            <TrashIcon /> Delete
          </Button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <form.AppForm>
            <form.SubmitButton size="sm">{entry ? "Save" : "Add entry"}</form.SubmitButton>
          </form.AppForm>
        </div>
      </div>
    </form>
  );
}

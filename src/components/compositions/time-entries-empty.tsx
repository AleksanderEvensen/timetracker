import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "#/components/ui/empty";

export type TimeEntriesEmptyProps = {
  title?: string;
  description?: string;
  subtitle?: string;
};

export function TimeEntriesEmpty({
  title = "Select a task",
  description = "Pick a task on the left to see its time entries.",
  subtitle = "last 30 days",
}: TimeEntriesEmptyProps) {
  return (
    <div className="flex flex-1 flex-col rounded-lg bg-card text-card-foreground ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-2 border-b border-border p-3">
        <div className="flex flex-col leading-tight">
          <h2 className="font-heading text-sm font-medium">Time Entries</h2>
          <span className="text-[0.625rem] text-muted-foreground">{subtitle}</span>
        </div>
      </div>
      <Empty className="border-0">
        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

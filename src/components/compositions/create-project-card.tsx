import { PlusIcon } from "lucide-react";

import { cn } from "#/lib/utils";

export function CreateProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/create-card flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-transparent p-6 text-muted-foreground transition-colors outline-none",
        "hover:border-foreground/30 hover:bg-card/30 hover:text-foreground",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors group-hover/create-card:bg-primary group-hover/create-card:text-primary-foreground">
        <PlusIcon className="size-4" />
      </span>
      <span className="text-xs/relaxed font-medium">Create new project</span>
    </button>
  );
}

import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  WalletIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { formatCurrency, formatDate } from "#/lib/format";
import type { Project } from "#/stores/projects";
import type { Currency, DateFormat } from "#/stores/settings";

export function ProjectOverview({
  project,
  currency,
  dateFormat,
}: {
  project: Project;
  currency: Currency;
  dateFormat: DateFormat;
}) {
  const earned = project.hourlyRate * project.hoursWorked;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>Project overview</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewStat
          icon={<CalendarIcon />}
          label="Started"
          value={formatDate(project.startDate, dateFormat)}
        />
        <OverviewStat
          icon={<DollarSignIcon />}
          label="Hourly rate"
          value={formatCurrency(project.hourlyRate, currency)}
        />
        <OverviewStat
          icon={<ClockIcon />}
          label="Hours worked"
          value={`${project.hoursWorked.toFixed(1)}h`}
        />
        <OverviewStat
          icon={<WalletIcon />}
          label="Earned"
          value={formatCurrency(earned, currency)}
        />
      </CardContent>
    </Card>
  );
}

function OverviewStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-input/20 p-3">
      <span className="flex items-center gap-1.5 text-xs/relaxed text-muted-foreground [&>svg]:size-3">
        {icon}
        {label}
      </span>
      <span className="font-heading text-sm font-medium tabular-nums">
        {value}
      </span>
    </div>
  );
}

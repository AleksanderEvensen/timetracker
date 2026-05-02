import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  DollarSignIcon,
  PencilIcon,
} from "lucide-react";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { formatCurrency, formatDate } from "#/lib/format";
import type { Currency, DateFormat } from "#/stores/settings";

export type ProjectCardProps = {
  name: string;
  startDate: string;
  hourlyRate: number;
  hoursWorked: number;
  currency: Currency;
  dateFormat: DateFormat;
  isCurrent?: boolean;
  onEdit?: () => void;
  onSelect?: () => void;
};

export function ProjectCard({
  name,
  startDate,
  hourlyRate,
  hoursWorked,
  currency,
  dateFormat,
  isCurrent = false,
  onEdit,
  onSelect,
}: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="truncate">{name}</span>
          {isCurrent && <Badge variant="secondary">Current</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <CalendarIcon className="size-3" />
          Started {formatDate(startDate, dateFormat)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <ProjectStat
          icon={<DollarSignIcon />}
          label="Hourly rate"
          value={formatCurrency(hourlyRate, currency)}
        />
        <ProjectStat
          icon={<ClockIcon />}
          label="Hours worked"
          value={`${hoursWorked.toFixed(1)}h`}
        />
        <ProjectStat
          icon={<DollarSignIcon />}
          label="Earned"
          value={formatCurrency(hourlyRate * hoursWorked, currency)}
        />
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <PencilIcon /> Edit
        </Button>
        <Button
          size="sm"
          variant={isCurrent ? "secondary" : "default"}
          onClick={onSelect}
          disabled={isCurrent}
          className="ml-auto"
        >
          {isCurrent ? (
            <>
              <CheckIcon /> Selected
            </>
          ) : (
            "Select"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProjectStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs/relaxed">
      <span className="flex items-center gap-1.5 text-muted-foreground [&>svg]:size-3">
        {icon}
        {label}
      </span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

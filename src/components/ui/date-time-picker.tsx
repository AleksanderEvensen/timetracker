import * as React from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import { Input } from "#/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { cn } from "#/lib/utils";

type DateTimePickerProps = {
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
};

function DateTimePicker({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "Pick a date & time",
  disabled,
  className,
  "aria-invalid": ariaInvalid,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined);
      return;
    }
    const next = new Date(date);
    if (value) {
      next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    } else {
      next.setHours(0, 0, 0, 0);
    }
    onChange?.(next);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hStr, mStr] = event.target.value.split(":");
    const h = Number.parseInt(hStr, 10);
    const m = Number.parseInt(mStr, 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return;
    const next = value ? new Date(value) : new Date();
    next.setHours(h, m, 0, 0);
    onChange?.(next);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onBlur?.();
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            aria-invalid={ariaInvalid}
            className={cn(
              "w-full justify-start font-normal",
              !value && "text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarIcon />
        {value ? format(value, "MMM d, yyyy HH:mm") : <span>{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={handleDateSelect} autoFocus />
        <div className="flex items-center gap-2 border-t border-border p-3">
          <ClockIcon className="size-3.5 text-muted-foreground" />
          <Input
            type="time"
            step={60}
            value={value ? format(value, "HH:mm") : ""}
            onChange={handleTimeChange}
            className="w-32 appearance-none"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateTimePicker };

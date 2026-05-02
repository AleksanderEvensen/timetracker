import { useId } from "react";

import { useFieldContext } from "#/hooks/form";
import { DateTimePicker } from "#/components/ui/date-time-picker";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/components/ui/field";

interface DateTimeFieldProps {
  label?: string;
  required?: boolean;
  description?: string;
  hideError?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

function localStringToDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function dateToLocalString(value?: Date): string {
  if (!value) return "";
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function DateTimeField({
  label,
  required,
  description,
  hideError = false,
  placeholder,
  disabled,
}: DateTimeFieldProps) {
  const field = useFieldContext<string>();
  const inputId = useId();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={inputId}>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <DateTimePicker
        id={inputId}
        value={localStringToDate(field.state.value)}
        onChange={(date) => field.handleChange(dateToLocalString(date))}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={isInvalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {!hideError && isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  );
}

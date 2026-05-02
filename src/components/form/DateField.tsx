import { useId } from "react";

import { useFieldContext } from "#/hooks/form";
import { DatePicker } from "#/components/ui/date-picker";
import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field";

interface DateFieldProps {
  label?: string;
  required?: boolean;
  description?: string;
  hideError?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

function dateStringToDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function dateToDateString(value?: Date): string {
  if (!value) return "";
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DateField({
  label,
  required,
  description,
  hideError = false,
  placeholder,
  disabled,
}: DateFieldProps) {
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
      <DatePicker
        id={inputId}
        value={dateStringToDate(field.state.value)}
        onChange={(date) => field.handleChange(dateToDateString(date))}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={isInvalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {!hideError && isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

import { useId, useMemo } from "react";

import { useFieldContext } from "#/hooks/form";
import { Field, FieldDescription, FieldError, FieldLabel } from "#/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

export type SelectFieldOption = {
  value: string;
  label: string;
};

interface SelectFieldProps {
  label?: string;
  required?: boolean;
  description?: string;
  hideError?: boolean;
  options: ReadonlyArray<SelectFieldOption>;
  placeholder?: string;
}

export function SelectField({
  label,
  required,
  description,
  hideError = false,
  options,
  placeholder = "Select…",
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  const inputId = useId();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const labels = useMemo(
    () => Object.fromEntries(options.map((o) => [o.value, o.label])),
    [options],
  );

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={inputId}>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value as string)}
      >
        <SelectTrigger id={inputId} className="w-full">
          <SelectValue>
            {(value: unknown) =>
              typeof value === "string" && labels[value] ? labels[value] : placeholder
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {!hideError && isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}

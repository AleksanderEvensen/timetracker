import { useFieldContext } from "#/hooks/form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { useId } from "react";

interface DateFieldProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  label?: string;
  required?: boolean;
  description?: string;
  hideError?: boolean;
}

export function DateField({
  label,
  required,
  description,
  hideError = false,
  ...props
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
      <Input
        {...props}
        type="date"
        id={inputId}
        name={field.name}
        required={required}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {!hideError && isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  );
}

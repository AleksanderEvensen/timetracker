import { useFieldContext } from "#/hooks/form-context";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/components/ui/field";
import { Textarea } from "#/components/ui/textarea";
import { useId } from "react";

interface TextareaFieldProps extends React.ComponentProps<typeof Textarea> {
  label?: string;
  required?: boolean;
  description?: string;
  hideError?: boolean;
}

export function TextareaField({
  label,
  required,
  description,
  hideError = false,
  ...props
}: TextareaFieldProps) {
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
      <Textarea
        {...props}
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

import { useFieldContext } from "#/hooks/form-context";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "#/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "#/components/ui/input-group";
import { useId } from "react";

interface NumberFieldProps extends Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "type" | "prefix"
> {
  label?: string;
  required?: boolean;
  description?: string;
  hideError?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function NumberField({
  label,
  required,
  description,
  hideError = false,
  prefix,
  suffix,
  ...props
}: NumberFieldProps) {
  const field = useFieldContext<number>();
  const inputId = useId();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const value = Number.isNaN(field.state.value) ? "" : field.state.value;

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={inputId}>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <InputGroup>
        {prefix != null && <InputGroupAddon>{prefix}</InputGroupAddon>}
        <InputGroupInput
          {...props}
          type="number"
          id={inputId}
          name={field.name}
          required={required}
          value={value}
          onChange={(e) => field.handleChange(e.target.valueAsNumber)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
        />
        {suffix != null && (
          <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {!hideError && isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  );
}

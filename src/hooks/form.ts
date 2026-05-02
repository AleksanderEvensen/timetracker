import { createFormHookContexts, createFormHook } from "@tanstack/react-form";
import { SubmitButton } from "#/components/form/SubmitButton";
import { InputField, PasswordField } from "#/components/form/BasicFields";
import { NumberField } from "#/components/form/NumberField";
import { DateField } from "#/components/form/DateField";
import { TextareaField } from "#/components/form/TextareaField";
import { FormErrors } from "#/components/form/FromErrors";

type FormAPI = {
  handleSubmit: () => void | Promise<void>;
  reset: () => void | Promise<void>;
};

export function formHandlers<TFormAPI extends FormAPI>(
  formApi: TFormAPI,
  preventDefault = true,
): React.ComponentProps<"form"> {
  return {
    onSubmit: (e) => {
      if (preventDefault) e.preventDefault();
      formApi.handleSubmit();
    },
    onReset: (e) => {
      if (preventDefault) e.preventDefault();
      formApi.reset();
    },
  };
}

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    InputField,
    PasswordField,
    NumberField,
    DateField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
    FormErrors,
  },
  fieldContext,
  formContext,
});

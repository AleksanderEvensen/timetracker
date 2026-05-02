import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { formHandlers, useAppForm } from "#/hooks/form";

export type ProjectFormValues = {
  name: string;
  startDate: string;
  hourlyRate: number;
};

export type ProjectCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProjectFormValues) => void | Promise<void>;
};

export function ProjectCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: ProjectCreateDialogProps) {
  const form = useAppForm({
    defaultValues: {
      name: "",
      startDate: new Date().toISOString().slice(0, 10),
      hourlyRate: 0,
    } as ProjectFormValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      form.reset();
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Set up a new project to start tracking time.
          </DialogDescription>
        </DialogHeader>
        <form {...formHandlers(form)} className="flex flex-col gap-4">
          <form.AppField
            name="name"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0 ? "Name is required" : undefined,
            }}
          >
            {(field) => (
              <field.InputField
                label="Name"
                required
                placeholder="My Project"
                autoFocus
              />
            )}
          </form.AppField>

          <form.AppField
            name="startDate"
            validators={{
              onChange: ({ value }) =>
                !value ? "Start date is required" : undefined,
            }}
          >
            {(field) => <field.DateField label="Start date" required />}
          </form.AppField>

          <form.AppField
            name="hourlyRate"
            validators={{
              onChange: ({ value }) =>
                Number.isNaN(value) || value <= 0
                  ? "Hourly rate must be greater than 0"
                  : undefined,
            }}
          >
            {(field) => (
              <field.NumberField
                label="Hourly rate"
                required
                min={0}
                step={0.5}
                prefix="$"
                suffix="/hr"
              />
            )}
          </form.AppField>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Create project</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

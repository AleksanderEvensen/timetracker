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

export type TaskFormValues = {
  name: string;
};

export type TaskCreateDialogProps = {
  open: boolean;
  projectName: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
};

export function TaskCreateDialog({
  open,
  projectName,
  onOpenChange,
  onSubmit,
}: TaskCreateDialogProps) {
  const form = useAppForm({
    defaultValues: { name: "" } as TaskFormValues,
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
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>
            Add a new task to {projectName}.
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
                placeholder="What are you working on?"
                autoFocus
              />
            )}
          </form.AppField>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <form.AppForm>
              <form.SubmitButton>Add task</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

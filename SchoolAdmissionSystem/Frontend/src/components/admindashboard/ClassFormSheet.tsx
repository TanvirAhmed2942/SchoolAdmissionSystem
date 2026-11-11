import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Shift = "morning" | "day";

const MAX_SEATS = 500;
// "Class Name" + " - Morning" must fit the backend limit (100 chars)
const MAX_NAME = 50;

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Class name must be at least 2 characters.")
    .max(MAX_NAME, `Class name must be at most ${MAX_NAME} characters.`),
  totalSeats: z
    .string()
    .min(1, "Total seat capacity is required.")
    .refine(
      (v) => /^\d+$/.test(v) && Number(v) > 0,
      "Total seat capacity must be a whole number greater than zero.",
    )
    .refine(
      (v) => Number(v) <= MAX_SEATS,
      `Total seat capacity cannot exceed ${MAX_SEATS}.`,
    ),
  shift: z.enum(["morning", "day"]),
});

type FormValues = z.infer<typeof formSchema>;

// Payload sent to the API: name is already "ClassName - Shift"
export type NewClass = {
  name: string;
  totalSeats: number;
};

const shifts: { value: Shift; title: string; description: string }[] = [
  { value: "morning", title: "Morning", description: "Morning session" },
  { value: "day", title: "Day", description: "Day session" },
];

const buildClassName = (name: string, shift: Shift) => {
  const title = shifts.find((s) => s.value === shift)?.title ?? shift;
  return `${name.trim()} - ${title}`;
};

type ClassFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (values: NewClass) => Promise<void>;
  existingNames: string[];
};

function ClassFormSheet({
  open,
  onOpenChange,
  onCreate,
  existingNames,
}: ClassFormSheetProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", totalSeats: "", shift: "morning" },
    mode: "onTouched",
  });

  function handleOpenChange(next: boolean) {
    if (!next) form.reset();
    onOpenChange(next);
  }

  async function onSubmit(values: FormValues) {
    const fullName = buildClassName(values.name, values.shift);

    const duplicate = existingNames.some(
      (n) => n.trim().toLowerCase() === fullName.toLowerCase(),
    );
    if (duplicate) {
      form.setError("name", {
        type: "validate",
        message: "This class already exists for the selected shift.",
      });
      return;
    }

    try {
      await onCreate({ name: fullName, totalSeats: Number(values.totalSeats) });
      handleOpenChange(false);
    } catch (err) {
      const message =
        (err as { data?: { error?: string } })?.data?.error ??
        "Could not create the class. Please try again.";
      form.setError("name", { type: "server", message });
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b p-6 text-left">
          <SheetTitle className="text-xl font-bold">Create Class</SheetTitle>
          <SheetDescription>
            Enter the class name, total seat capacity and shift.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="create-class-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="class-name">Class Name</FieldLabel>
                    <Input
                      {...field}
                      id="class-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Class Five"
                      autoComplete="off"
                      maxLength={MAX_NAME}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="totalSeats"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="total-seats">
                      Total Seat Capacity
                    </FieldLabel>
                    <Input
                      {...field}
                      id="total-seats"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter total seats"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={String(MAX_SEATS).length}
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ""))
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="shift"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet>
                    <FieldLegend variant="label">Shift</FieldLegend>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-3"
                    >
                      {shifts.map((s) => (
                        <FieldLabel key={s.value} htmlFor={`shift-${s.value}`}>
                          <Field
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldContent>
                              <FieldTitle>{s.title}</FieldTitle>
                              <FieldDescription>
                                {s.description}
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem
                              value={s.value}
                              id={`shift-${s.value}`}
                              aria-invalid={fieldState.invalid}
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />
            </FieldGroup>
          </form>
        </div>

        <SheetFooter className="flex-row justify-end gap-3 border-t p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-class-form"
            disabled={form.formState.isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Class"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ClassFormSheet;

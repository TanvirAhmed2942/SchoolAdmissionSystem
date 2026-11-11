import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useCreateHoldMutation, type AdmissionHold } from "@/api/StudentApi";
import ReservationStatus from "./ReservationHeld";
import { useGetClassesQuery } from "@/api/AdminApi";

const formSchema = z.object({
  birthRegistrationNumber: z
    .string()
    .regex(/^\d{17}$/, "The number must contain exactly 17 digits."),
});

type FormValues = z.infer<typeof formSchema>;

type Reservation = {
  hold: AdmissionHold;
  studentId: string; // masked, for display only
  rawStudentId: string; // full value, needed for confirm / cancel calls
};

function ReservationForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: classes = [], isLoading, isError } = useGetClassesQuery();
  const selectedClass = classes.find((c) => c.id === id);

  const [createHold, { isLoading: creating }] = useCreateHoldMutation();
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { birthRegistrationNumber: "" },
    mode: "onChange",
  });

  // Wait for the data, otherwise the redirect below fires before the class loads
  if (isLoading) return <p className="p-6 text-slate-500">Loading...</p>;
  if (isError)
    return (
      <p className="p-6 text-red-600">
        Could not load the class. Check that the API is running.
      </p>
    );

  // After reserving, show the status page instead of the form.
  // Must come before the redirect so a seat count that drops to 0 after
  // reserving doesn't bounce the user back to "/".
  if (reservation && selectedClass) {
    return (
      <ReservationStatus
        applicationId={reservation.hold.id}
        classTitle={selectedClass.name}
        studentId={reservation.studentId}
        holdId={reservation.hold.id}
        rawStudentId={reservation.rawStudentId}
        expiresAt={reservation.hold.expiresAt}
      />
    );
  }

  // Bad URL or full class: send them back
  if (!selectedClass || selectedClass.availableSeats <= 0) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(values: FormValues) {
    const n = values.birthRegistrationNumber;

    try {
      const hold = await createHold({
        classId: selectedClass!.id,
        studentId: n,
      }).unwrap();

      setReservation({
        hold,
        studentId: `${n.slice(0, 4)} •••• •••• ${n.slice(-4)}`,
        rawStudentId: n,
      });
    } catch (err) {
      const message =
        (err as { data?: { error?: string } })?.data?.error ??
        "Could not reserve the seat. Please try again.";
      form.setError("birthRegistrationNumber", { type: "server", message });
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to available classes
      </Link>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <p className="text-sm text-indigo-600">Seat Reservation</p>
          <h1 className="mt-2 text-2xl font-bold">Reserve a Seat</h1>
          <p className="mt-1 text-sm text-slate-600">
            Complete the student information below to hold a seat.
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-end justify-between rounded-lg bg-indigo-50 p-4">
            <div>
              <p className="text-xs font-medium uppercase text-indigo-600">
                Selected Class
              </p>
              <p className="text-lg font-semibold">{selectedClass.name}</p>
            </div>
            <p className="text-sm text-indigo-600">
              {selectedClass.availableSeats} seats available
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="birthRegistrationNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="birth-registration-number">
                      Student Birth Registration Number
                    </FieldLabel>
                    <Input
                      {...field}
                      id="birth-registration-number"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter 17-digit number"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={17}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, "").slice(0, 17),
                        )
                      }
                    />
                    <div className="flex items-center justify-between">
                      <FieldDescription>
                        {fieldState.invalid
                          ? ""
                          : "The number must contain exactly 17 digits."}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldDescription>
                      <span className="text-xs text-slate-500">
                        {field.value.length}/17
                      </span>
                    </div>
                  </Field>
                )}
              />

              <Field orientation="horizontal" className="justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={!form.formState.isValid || creating}
                >
                  {creating ? "Reserving..." : "Reserve Seat"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReservationForm;

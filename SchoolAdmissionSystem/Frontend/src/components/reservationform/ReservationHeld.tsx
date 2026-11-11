import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Check } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useCancelHoldMutation,
  useConfirmHoldMutation,
} from "@/api/StudentApi";
import ConfirmAdmissionModal from "./ConfirmAdmissionModal";

type Status = "held" | "confirmed" | "cancelled" | "expired";

const statusConfig: Record<
  Status,
  {
    eyebrow: string;
    title: string;
    badge: string;
    badgeClass: string;
    panelClass: string;
    timerClass: string;
    heading: string;
    message: string;
  }
> = {
  held: {
    eyebrow: "Seat Reserved",
    title: "Active Reservation",
    badge: "HELD",
    badgeClass: "border-amber-300 bg-amber-50 text-amber-700",
    panelClass: "bg-amber-50/60 border-amber-100",
    timerClass: "text-orange-700",
    heading: "Time remaining to confirm",
    message:
      "Confirm admission before the timer ends. Otherwise, this reservation will expire and the seat will be released.",
  },
  confirmed: {
    eyebrow: "Admission Complete",
    title: "Admission Confirmed",
    badge: "CONFIRMED",
    badgeClass: "border-emerald-300 bg-emerald-50 text-emerald-700",
    panelClass: "bg-emerald-50 border-emerald-100",
    timerClass: "text-emerald-900",
    heading: "The student's admission has been confirmed.",
    message: "No further action is required for this application.",
  },
  cancelled: {
    eyebrow: "Reservation Cancelled",
    title: "Reservation Details",
    badge: "CANCELLED",
    badgeClass: "border-red-200 bg-red-50 text-red-700",
    panelClass: "bg-slate-50 border-slate-200",
    timerClass: "text-slate-500",
    heading: "Reservation cancelled",
    message:
      "This reservation was cancelled and the seat has been returned to availability.",
  },
  expired: {
    eyebrow: "Reservation Ended",
    title: "Reservation Details",
    badge: "EXPIRED",
    badgeClass: "border-transparent bg-slate-100 text-slate-600",
    panelClass: "bg-slate-50 border-slate-200",
    timerClass: "text-slate-500",
    heading: "Reservation expired",
    message:
      "This reservation has expired and the seat is no longer held. Return to Available Classes to make a new reservation.",
  },
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const expirationFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

// If the server sends a timestamp without a timezone, treat it as UTC
function parseServerDate(value: string) {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  return new Date(hasZone ? value : `${value}Z`).getTime();
}

const errorMessage = (err: unknown) =>
  (err as { data?: { error?: string } })?.data?.error ??
  "Something went wrong. Please try again.";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}

type ReservationStatusProps = {
  applicationId: string;
  classTitle: string;
  studentId: string; // masked, display only
  holdId: string;
  rawStudentId: string; // sent to the API as X-Student-Id
  expiresAt: string; // ISO string from the server
};

function ReservationStatus({
  applicationId,
  classTitle,
  studentId,
  holdId,
  rawStudentId,
  expiresAt: expiresAtIso,
}: ReservationStatusProps) {
  const expiresAt = parseServerDate(expiresAtIso);

  const [confirmHold, { isLoading: confirming }] = useConfirmHoldMutation();
  const [cancelHold, { isLoading: cancelling }] = useCancelHoldMutation();

  const [now, setNow] = useState(() => Date.now());
  const [cancelled, setCancelled] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const secondsLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const status: Status = confirmed
    ? "confirmed"
    : cancelled
      ? "cancelled"
      : secondsLeft === 0
        ? "expired"
        : "held";
  const isHeld = status === "held";
  const busy = confirming || cancelling;
  const config = statusConfig[status];

  useEffect(() => {
    if (!isHeld) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isHeld]);

  async function handleConfirm() {
    setError(null);
    try {
      await confirmHold({ holdId, studentId: rawStudentId }).unwrap();
      setConfirmed(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setConfirmOpen(false);
    }
  }

  async function handleCancel() {
    setError(null);
    try {
      await cancelHold({ holdId, studentId: rawStudentId }).unwrap();
      setCancelled(true);
    } catch (err) {
      setError(errorMessage(err));
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

      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex items-start justify-between p-6">
          <div>
            <p className="text-sm text-indigo-600">{config.eyebrow}</p>
            <h1 className="mt-2 text-2xl font-bold">{config.title}</h1>
          </div>
          <Badge
            variant="outline"
            className={cn("font-bold", config.badgeClass)}
          >
            {config.badge}
          </Badge>
        </div>

        <div
          className={cn(
            "space-y-3 border-y px-6 py-8 text-center",
            config.panelClass,
          )}
        >
          {status === "confirmed" ? (
            <>
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="size-5" />
              </div>
              <p className={cn("font-semibold", config.timerClass)}>
                {config.heading}
              </p>
              <p className="text-sm text-emerald-800">{config.message}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {config.heading}
              </p>
              <p
                className={cn(
                  "font-mono text-6xl font-bold tabular-nums",
                  config.timerClass,
                )}
              >
                {formatTime(isHeld ? secondsLeft : 0)}
              </p>
              <p className="mx-auto max-w-sm text-sm text-slate-600">
                {config.message}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <Detail label="Application ID" value={applicationId} />
          <Detail label="Class Name" value={classTitle} />
          <Detail label="Student ID" value={studentId} />
          <Detail
            label="Expiration Time"
            value={expirationFormatter.format(expiresAt)}
          />
        </div>

        {error && (
          <p className="mx-6 mb-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="mx-6 border-t" />

        <div className="flex justify-end gap-3 p-6">
          {isHeld && (
            <Button variant="outline" disabled={busy} onClick={handleCancel}>
              {cancelling ? "Cancelling..." : "Cancel Reservation"}
            </Button>
          )}
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            disabled={!isHeld || busy}
            onClick={() => setConfirmOpen(true)}
          >
            {status === "confirmed"
              ? "Admission Confirmed"
              : confirming
                ? "Confirming..."
                : "Confirm Admission"}
          </Button>
        </div>
      </Card>

      <ConfirmAdmissionModal
        open={confirmOpen && isHeld}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirm}
        applicationId={applicationId}
        classTitle={classTitle}
        studentId={studentId}
      />
    </div>
  );
}

export default ReservationStatus;

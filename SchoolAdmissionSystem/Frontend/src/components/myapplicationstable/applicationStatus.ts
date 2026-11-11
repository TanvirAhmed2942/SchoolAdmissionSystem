import type { AdmissionHold, HoldStatus } from "@/api/StudentApi";

export const statusStyles: Record<
  HoldStatus,
  { label: string; className: string }
> = {
  HELD: {
    label: "HELD",
    className: "border-amber-300 bg-amber-50 text-amber-700",
  },
  CONFIRMED: {
    label: "CONFIRMED",
    className: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "CANCELLED",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  EXPIRED: {
    label: "EXPIRED",
    className: "border-transparent bg-slate-100 text-slate-600",
  },
};

// Shown for any status the UI doesn't recognise.
export const fallbackClassName = "border-slate-300 bg-white text-slate-500";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

// Server timestamps without a timezone are UTC.
// Delete this once the API returns timestamps with a "Z".
export function parseServerDate(value: string) {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  return new Date(hasZone ? value : `${value}Z`);
}

export function formatServerDate(value: string | null) {
  return value ? dateFormatter.format(parseServerDate(value)) : "—";
}

// A HELD hold past its expiry is effectively expired, even if the
// backend hasn't flipped the status yet.
export function getDisplayStatus(app: AdmissionHold): HoldStatus {
  if (
    app.status === "HELD" &&
    parseServerDate(app.expiresAt).getTime() < Date.now()
  ) {
    return "EXPIRED";
  }
  return app.status;
}

export function getStatusBadge(app: AdmissionHold) {
  const displayStatus = getDisplayStatus(app);
  return (
    statusStyles[displayStatus] ?? {
      label: String(displayStatus),
      className: fallbackClassName,
    }
  );
}

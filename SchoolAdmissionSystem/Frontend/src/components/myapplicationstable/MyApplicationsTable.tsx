import { useState, type FormEvent } from "react";
import { Link } from "react-router";

import { cn } from "../../../lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetMyApplicationsQuery,
  type AdmissionHold,
  type HoldStatus,
} from "@/api/StudentApi";

const STORAGE_KEY = "studentId";
const STUDENT_ID_PATTERN = /^\d{17}$/;

const statusStyles: Record<HoldStatus, { label: string; className: string }> = {
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

// Shown for any status the UI doesn't recognise, instead of
// silently pretending it's EXPIRED.
const fallbackClassName = "border-slate-300 bg-white text-slate-500";

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
function parseServerDate(value: string) {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(value);
  return new Date(hasZone ? value : `${value}Z`);
}

// A HELD hold past its expiry is effectively expired, even if the
// backend hasn't flipped the status yet.
function getDisplayStatus(app: AdmissionHold): HoldStatus {
  if (
    app.status === "HELD" &&
    parseServerDate(app.expiresAt).getTime() < Date.now()
  ) {
    return "EXPIRED";
  }
  return app.status;
}

const headClass = "text-xs font-semibold uppercase text-slate-500";

function readStoredId() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function MessageRow({
  children,
  className = "text-slate-500",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={6}
        className={cn("py-10 text-center text-sm", className)}
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

function MyApplicationsTable() {
  const [input, setInput] = useState(readStoredId);
  const [studentId, setStudentId] = useState(readStoredId);

  const isValid = STUDENT_ID_PATTERN.test(studentId);

  const {
    currentData: applications = [],
    isFetching,
    isError,
    refetch,
  } = useGetMyApplicationsQuery(studentId, {
    skip: !isValid,
    refetchOnMountOrArgChange: true,
  });

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!STUDENT_ID_PATTERN.test(input)) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, input);
    } catch {
      /* storage unavailable, ignore */
    }
    setStudentId(input);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-3">
        <Input
          value={input}
          onChange={(e) =>
            setInput(e.target.value.replace(/\D/g, "").slice(0, 17))
          }
          placeholder="Enter 17-digit birth registration number"
          inputMode="numeric"
          autoComplete="off"
          maxLength={17}
          className="max-w-sm"
        />
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={!STUDENT_ID_PATTERN.test(input)}
        >
          Show my applications
        </Button>
      </form>

      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className={cn(headClass, "px-6 py-4")}>
                Application ID
              </TableHead>
              <TableHead className={headClass}>Class Name</TableHead>
              <TableHead className={headClass}>Created At</TableHead>
              <TableHead className={headClass}>Expires At</TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={cn(headClass, "px-6 text-right")}>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!isValid ? (
              <MessageRow>
                Enter the student's birth registration number to see
                applications.
              </MessageRow>
            ) : isFetching ? (
              <MessageRow>Loading applications...</MessageRow>
            ) : isError ? (
              <MessageRow className="text-red-600">
                Could not load applications.{" "}
                <button className="underline" onClick={() => refetch()}>
                  Try again
                </button>
              </MessageRow>
            ) : applications.length === 0 ? (
              <MessageRow>You haven't made any applications yet.</MessageRow>
            ) : (
              applications.map((app) => {
                const displayStatus = getDisplayStatus(app);
                const status = statusStyles[displayStatus] ?? {
                  label: String(displayStatus),
                  className: fallbackClassName,
                };

                return (
                  <TableRow key={app.id}>
                    <TableCell className="px-6 py-4 font-mono text-xs font-semibold">
                      {app.id}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {app.className}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {dateFormatter.format(parseServerDate(app.createdAt))}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {dateFormatter.format(parseServerDate(app.expiresAt))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[11px] font-bold",
                          status.className,
                        )}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Link
                        to={`/applications/${app.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MyApplicationsTable;

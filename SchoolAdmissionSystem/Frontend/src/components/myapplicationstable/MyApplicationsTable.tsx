import { useState, type FormEvent } from "react";

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
import { useGetMyApplicationsQuery } from "@/api/StudentApi";

import { formatServerDate, getStatusBadge } from "./applicationStatus";
import ViewApplicationModal from "./ViewApplicationModal";

const STORAGE_KEY = "studentId";
const STUDENT_ID_PATTERN = /^\d{17}$/;

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  // Get the selected application from the latest query data.
  const selectedApplication =
    applications.find((a) => a.id === selectedId) ?? null;

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    if (!STUDENT_ID_PATTERN.test(input)) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, input);
    } catch {
      // Storage unavailable, ignore.
    }

    setSelectedId(null);
    setStudentId(input);
  }

  function handleModalChange(open: boolean) {
    if (!open) {
      setSelectedId(null);
    }
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
                <button
                  type="button"
                  className="underline"
                  onClick={() => refetch()}
                >
                  Try again
                </button>
              </MessageRow>
            ) : applications.length === 0 ? (
              <MessageRow>You haven't made any applications yet.</MessageRow>
            ) : (
              applications.map((app) => {
                const status = getStatusBadge(app);

                return (
                  <TableRow key={app.id}>
                    <TableCell className="px-6 py-4 font-mono text-xs font-semibold">
                      {app.id}
                    </TableCell>

                    <TableCell className="text-slate-700">
                      {app.className}
                    </TableCell>

                    <TableCell className="text-slate-600">
                      {formatServerDate(app.createdAt)}
                    </TableCell>

                    <TableCell className="text-slate-600">
                      {formatServerDate(app.expiresAt)}
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
                      <Button
                        variant="link"
                        className="h-auto p-0 text-indigo-600 hover:text-indigo-800"
                        onClick={() => setSelectedId(app.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ViewApplicationModal
        application={selectedApplication}
        open={selectedId !== null}
        onOpenChange={handleModalChange}
      />
    </div>
  );
}

export default MyApplicationsTable;

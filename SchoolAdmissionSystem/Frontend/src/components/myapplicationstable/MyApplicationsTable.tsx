import { Link } from "react-router";

import { cn } from "../../../lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applications, type ApplicationStatus } from "../../../data/data";

const statusStyles: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  held: {
    label: "HELD",
    className: "border-amber-300 bg-amber-50 text-amber-700",
  },
  confirmed: {
    label: "CONFIRMED",
    className: "border-emerald-300 bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "CANCELLED",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  expired: {
    label: "EXPIRED",
    className: "border-transparent bg-slate-100 text-slate-600",
  },
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const headClass = "text-xs font-semibold uppercase text-slate-500";

function MyApplicationsTable() {
  return (
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
          {applications.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-10 text-center text-sm text-slate-500"
              >
                You haven't made any applications yet.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => {
              const status = statusStyles[app.status];

              return (
                <TableRow key={app.id}>
                  <TableCell className="px-6 py-4 font-semibold">
                    {app.id}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {app.className}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {dateFormatter.format(new Date(app.createdAt))}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {dateFormatter.format(new Date(app.expiresAt))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-[11px] font-bold", status.className)}
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
  );
}

export default MyApplicationsTable;

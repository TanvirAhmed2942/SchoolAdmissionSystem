import { useNavigate } from "react-router";

import { cn } from "../../../lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { classes } from "../../../data/data";

function ApplyClassTable() {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                Class Name
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                Total Seats
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                Available
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                Held
              </TableHead>
              <TableHead className="text-center text-xs font-semibold uppercase text-slate-500">
                Confirmed
              </TableHead>
              <TableHead className="px-6 text-right text-xs font-semibold uppercase text-slate-500">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {classes.map((c) => {
              const isFull = c.available === 0;

              return (
                <TableRow key={c.id}>
                  <TableCell className="px-6 py-5 font-semibold">
                    {c.name}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.totalSeats}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-center font-bold",
                      isFull
                        ? "font-normal text-slate-400"
                        : "text-emerald-700",
                    )}
                  >
                    {c.available}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.held}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.confirmed}
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    {isFull ? (
                      <Button disabled variant="secondary">
                        Full
                      </Button>
                    ) : (
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => navigate(`/create-reservation/${c.id}`)}
                      >
                        Apply
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-slate-500">
        Seat availability is updated when reservations are made or confirmed.
      </p>
    </div>
  );
}

export default ApplyClassTable;

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
import { useGetClassesQuery } from "@/api/AdminApi";

const headClass = "text-center text-xs font-semibold uppercase text-slate-500";

function ApplyClassTable() {
  const navigate = useNavigate();
  const {
    data: classes = [],
    isLoading,
    isError,
    refetch,
  } = useGetClassesQuery(undefined, {
    // Seat counts change as other students apply, so keep them fresh
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
  });

  return (
    <div className="space-y-2">
      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                Class Name
              </TableHead>
              <TableHead className={headClass}>Total Seats</TableHead>
              <TableHead className={headClass}>Available</TableHead>
              <TableHead className={headClass}>Held</TableHead>
              <TableHead className={headClass}>Confirmed</TableHead>
              <TableHead className="px-6 text-right text-xs font-semibold uppercase text-slate-500">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  Loading classes...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-red-600"
                >
                  Could not load classes.{" "}
                  <button className="underline" onClick={() => refetch()}>
                    Try again
                  </button>
                </TableCell>
              </TableRow>
            ) : classes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  No classes are open for admission yet.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((c) => {
                const isFull = c.availableSeats <= 0;

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
                      {c.availableSeats}
                    </TableCell>
                    <TableCell className="text-center text-slate-600">
                      {c.heldSeats}
                    </TableCell>
                    <TableCell className="text-center text-slate-600">
                      {c.confirmedSeats}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      {isFull ? (
                        <Button disabled variant="secondary">
                          Full
                        </Button>
                      ) : (
                        <Button
                          className="bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => {
                            console.log("navigating to", c.id);
                            navigate(`/create-reservation/${c.id}`);
                          }}
                        >
                          Apply
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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

import { useState } from "react";

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

import ClassFormSheet from "./ClassFormSheet";
import { useCreateClassMutation, useGetClassesQuery } from "@/api/AdminApi";

const headClass = "text-center text-xs font-semibold uppercase text-slate-500";

function ClassTableOverview() {
  const { data: classes = [], isLoading, isError } = useGetClassesQuery();
  const [createClass] = useCreateClassMutation();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Classes</h1>
          <p className="mt-1 text-sm text-slate-600">
            View all admission classes and capacities.
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => setSheetOpen(true)}
        >
          Create Class
        </Button>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className={cn(headClass, "px-6 py-4 text-left")}>
                Class Name
              </TableHead>
              <TableHead className={headClass}>Total Seats</TableHead>
              <TableHead className={headClass}>Available Seats</TableHead>
              <TableHead className={headClass}>Held Seats</TableHead>
              <TableHead className={headClass}>Confirmed Seats</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  Loading classes...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-red-600"
                >
                  Could not load classes. Check that the API is running.
                </TableCell>
              </TableRow>
            ) : classes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  No classes yet. Create your first class.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="px-6 py-5 font-semibold">
                    {c.name}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.totalSeats}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-700">
                    {c.availableSeats}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.heldSeats}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.confirmedSeats}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ClassFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        existingNames={classes.map((c) => c.name)}
        onCreate={async (values) => {
          await createClass(values).unwrap();
        }}
      />
    </div>
  );
}

export default ClassTableOverview;

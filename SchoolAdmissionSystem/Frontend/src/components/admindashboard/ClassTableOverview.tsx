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
import { classes, type ClassSeat } from "../../../data/data";
import ClassFormSheet, { type NewClass } from "./ClassFormSheet";

const headClass = "text-center text-xs font-semibold uppercase text-slate-500";

function ClassTableOverview() {
  // Local state for now. Replace with your API / query data.
  const [classList, setClassList] = useState<ClassSeat[]>(classes);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleCreate(values: NewClass) {
    // TODO: call your create-class API here
    setClassList((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((c) => c.id)) + 1,
        name: values.name,
        totalSeats: values.totalSeats,
        available: values.totalSeats,
        held: 0,
        confirmed: 0,
        shift: values.shift,
      },
    ]);
  }

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
            {classList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  No classes yet. Create your first class.
                </TableCell>
              </TableRow>
            ) : (
              classList.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="px-6 py-5 font-semibold">
                    {c.name}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.totalSeats}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-700">
                    {c.available}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.held}
                  </TableCell>
                  <TableCell className="text-center text-slate-600">
                    {c.confirmed}
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
        onCreate={handleCreate}
        existingNames={classList.map((c) => c.name)}
      />
    </div>
  );
}

export default ClassTableOverview;

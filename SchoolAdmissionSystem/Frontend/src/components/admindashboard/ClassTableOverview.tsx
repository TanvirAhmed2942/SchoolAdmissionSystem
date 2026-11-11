import { useState } from "react";
import { Trash2 } from "lucide-react";

import { cn } from "../../../lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ClassFormSheet from "./ClassFormSheet";
import {
  useCreateClassMutation,
  useDeleteClassMutation,
  useGetClassesQuery,
  type SchoolClass,
} from "@/api/AdminApi";

const headClass = "text-center text-xs font-semibold uppercase text-slate-500";
const COLUMN_COUNT = 6;

function ClassTableOverview() {
  const { data: classes = [], isLoading, isError } = useGetClassesQuery();
  const [createClass] = useCreateClassMutation();
  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleConfirmDelete() {
    if (!classToDelete) return;
    setDeleteError(null);
    try {
      await deleteClass(classToDelete.id).unwrap();
      setClassToDelete(null);
    } catch {
      const name = classToDelete.name;
      setClassToDelete(null);
      setDeleteError(
        `Could not delete "${name}". It may have active applications.`,
      );
    }
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

      {deleteError && (
        <p className="text-sm text-red-600" role="alert">
          {deleteError}
        </p>
      )}

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
              <TableHead className={cn(headClass, "px-6")}>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-sm text-slate-500"
                >
                  Loading classes...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-sm text-red-600"
                >
                  Could not load classes. Check that the API is running.
                </TableCell>
              </TableRow>
            ) : classes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
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
                  <TableCell className="px-6 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      aria-label={`Delete ${c.name}`}
                      onClick={() => {
                        setDeleteError(null);
                        setClassToDelete(c);
                      }}
                    >
                      <Trash2 size={16} strokeWidth={1.75} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={classToDelete !== null}
        onOpenChange={(open) => {
          // Don't allow closing mid-request
          if (!open && !isDeleting) setClassToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this class?</AlertDialogTitle>
            <AlertDialogDescription>
              {classToDelete
                ? `"${classToDelete.name}" will be permanently removed. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

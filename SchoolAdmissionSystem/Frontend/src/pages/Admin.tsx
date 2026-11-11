import { useState } from "react";
import { BroomSparkles } from "lucide-react";

import { useDeleteAllDataMutation, useGetClassesQuery } from "@/api/AdminApi";
import Heading from "@/common/Heading";
import ClassTableOverview from "@/components/admindashboard/ClassTableOverview";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const headingProps = {
  upper_subtitle: "Administration",
  title: "Admin Dashboard",
  subtitle: "Manage classes and review current seat availability.",
};

function Admin() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { isLoading, isError } = useGetClassesQuery(undefined);
  const [deleteAllData, { isLoading: isDeleting }] = useDeleteAllDataMutation();

  async function handleDeleteAll() {
    setDeleteError(null);
    try {
      await deleteAllData().unwrap();
      setDialogOpen(false);
    } catch {
      setDialogOpen(false);
      setDeleteError("Could not delete data. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Heading {...headingProps} />

        <AlertDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            // Don't let the dialog close mid-request
            if (!isDeleting) setDialogOpen(open);
          }}
        >
          <AlertDialogTrigger>
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              variant="secondary"
              disabled={isDeleting}
            >
              <BroomSparkles size={16} strokeWidth={1.75} />
              {isDeleting ? "Deleting..." : "Delete All Data"}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete all data?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes all classes and all admission
                applications. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, delete everything"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {deleteError && (
        <p className="text-sm text-red-600" role="alert">
          {deleteError}
        </p>
      )}

      {isLoading ? (
        <p>Loading classes...</p>
      ) : isError ? (
        <p>Failed to load classes.</p>
      ) : (
        <ClassTableOverview />
      )}
    </div>
  );
}

export default Admin;

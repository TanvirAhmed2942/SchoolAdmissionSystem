import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmAdmissionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  applicationId: string;
  classTitle: string;
  studentId: string;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function ConfirmAdmissionModal({
  open,
  onOpenChange,
  onConfirm,
  applicationId,
  classTitle,
  studentId,
}: ConfirmAdmissionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b p-6 text-left">
          <DialogTitle className="text-xl font-bold">
            Confirm Admission
          </DialogTitle>
          <DialogDescription>
            Please verify the application details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-6">
          <dl className="space-y-3 rounded-lg bg-slate-50 p-4">
            <SummaryRow label="Application ID" value={applicationId} />
            <SummaryRow label="Class Name" value={classTitle} />
            <SummaryRow label="Student ID" value={studentId} />
          </dl>

          <p className="text-sm text-slate-600">
            By confirming, you accept this seat for the student. This action
            will complete the admission and cannot be undone.
          </p>
        </div>

        <DialogFooter className="border-t p-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={onConfirm}
          >
            Confirm Admission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmAdmissionModal;

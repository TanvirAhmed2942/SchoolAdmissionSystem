import { cn } from "../../../lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdmissionHold } from "@/api/StudentApi";

import { formatServerDate, getStatusBadge } from "./applicationStatus";

type Props = {
  application: AdmissionHold | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b py-3 last:border-b-0">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="break-all text-right text-sm font-medium text-slate-900">
        {children}
      </dd>
    </div>
  );
}

function ViewApplicationModal({ application, open, onOpenChange }: Props) {
  const status = application ? getStatusBadge(application) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {application && status && (
          <>
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Full details for this admission application.
              </DialogDescription>
            </DialogHeader>

            <dl>
              <DetailRow label="Application ID">
                <span className="font-mono text-xs">{application.id}</span>
              </DetailRow>

              <DetailRow label="Class">{application.className}</DetailRow>

              <DetailRow label="Student ID">
                <span className="font-mono text-xs">
                  {application.studentId}
                </span>
              </DetailRow>

              <DetailRow label="Status">
                <Badge
                  variant="outline"
                  className={cn("text-[11px] font-bold", status.className)}
                >
                  {status.label}
                </Badge>
              </DetailRow>

              <DetailRow label="Created">
                {formatServerDate(application.createdAt)}
              </DetailRow>

              <DetailRow label="Last modified">
                {formatServerDate(application.modifiedAt)}
              </DetailRow>

              <DetailRow label="Expires">
                {formatServerDate(application.expiresAt)}
              </DetailRow>

              <DetailRow label="Confirmed">
                {formatServerDate(application.confirmedAt)}
              </DetailRow>
            </dl>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewApplicationModal;

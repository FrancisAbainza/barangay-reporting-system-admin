import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScheduledDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scheduledDate: string;
  setScheduledDate: (value: string) => void;
  onSubmit: () => void;
}

export function ScheduledDialog({
  isOpen,
  onOpenChange,
  scheduledDate,
  setScheduledDate,
  onSubmit,
}: ScheduledDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
    setScheduledDate("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Complaint</DialogTitle>
          <DialogDescription>
            Set the date when this complaint is scheduled to be addressed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="scheduledDate">
              Scheduled Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="scheduledDate"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!scheduledDate}
          >
            Mark as Scheduled
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

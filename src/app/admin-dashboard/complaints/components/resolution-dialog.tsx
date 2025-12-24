import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResolutionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resolutionDescription: string;
  setResolutionDescription: (value: string) => void;
  resolutionBudget: string;
  setResolutionBudget: (value: string) => void;
  onSubmit: () => void;
}

export function ResolutionDialog({
  isOpen,
  onOpenChange,
  resolutionDescription,
  setResolutionDescription,
  resolutionBudget,
  setResolutionBudget,
  onSubmit,
}: ResolutionDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
    setResolutionDescription("");
    setResolutionBudget("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark as Resolved</DialogTitle>
          <DialogDescription>
            Provide details about how this complaint was resolved
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="resolutionDescription">
              Resolution Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="resolutionDescription"
              placeholder="Describe how the complaint was resolved..."
              value={resolutionDescription}
              onChange={(e) => setResolutionDescription(e.target.value)}
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolutionBudget">
              Budget (Optional)
            </Label>
            <Input
              id="resolutionBudget"
              type="number"
              placeholder="Enter budget amount"
              value={resolutionBudget}
              onChange={(e) => setResolutionBudget(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!resolutionDescription.trim()}
          >
            Mark as Resolved
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { TabsContent } from "@/components/ui/tabs";
import { FileText, User, Calendar, CheckCircle, ImageIcon, Receipt, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import type { Complaint } from "@/contexts/complaint-db-context";

interface ComplaintDetailsTabProps {
  complaint: Complaint;
  formatDate: (date: Date) => string;
}

export function ComplaintDetailsTab({ complaint, formatDate }: ComplaintDetailsTabProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <TabsContent value="details" className="space-y-4 p-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Description
          </h4>
          <p className="text-sm text-muted-foreground">{complaint.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <User className="h-4 w-4" />
              Complainant
            </h4>
            <p className="text-sm">{complaint.complainantName}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Submitted
            </h4>
            <p className="text-sm">{formatDate(complaint.createdAt)}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last Updated
            </h4>
            <p className="text-sm">{formatDate(complaint.updatedAt)}</p>
          </div>
          {complaint.resolvedAt && (
            <div>
              <h4 className="font-semibold mb-1 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolved
              </h4>
              <p className="text-sm">{formatDate(complaint.resolvedAt)}</p>
            </div>
          )}
        </div>

        {complaint.images && complaint.images.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {complaint.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.uri)}
                  className="group relative aspect-square border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={img.uri}
                    alt={`Complaint image ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {complaint.resolutionDetails && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Resolution Details
            </h4>
            <p className="text-sm mb-2">{complaint.resolutionDetails.description}</p>
            {complaint.resolutionDetails.budget && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Budget: ₱{complaint.resolutionDetails.budget.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-4xl w-full p-0 overflow-hidden border-0">
          <DialogTitle className="sr-only">Complaint Details</DialogTitle>
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size preview"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}

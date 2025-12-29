import { TabsContent } from "@/components/ui/tabs";
import { FileText, User, Calendar, CheckCircle, ImageIcon, Receipt, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { InfoCard } from "@/components/ui/info-card";
import { useState } from "react";
import type { Complaint } from "@/types/complaint";
import { formatDate } from "@/lib/date-formatter";

interface ComplaintDetailsTabProps {
  complaint: Complaint;
}

export function ComplaintDetailsTab({ complaint }: ComplaintDetailsTabProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <TabsContent value="details" className="space-y-4 p-6">
      <div className="space-y-4">
        <InfoCard icon={FileText} title="Description">
          <p className="text-sm text-muted-foreground">{complaint.description}</p>
        </InfoCard>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoCard icon={User} title="Complainant">
            <p className="text-sm">{complaint.complainantName}</p>
          </InfoCard>
          <InfoCard icon={Calendar} title="Submitted">
            <p className="text-sm">{formatDate(complaint.createdAt)}</p>
          </InfoCard>
          <InfoCard icon={Calendar} title="Last Updated">
            <p className="text-sm">{formatDate(complaint.updatedAt)}</p>
          </InfoCard>
          {complaint.scheduledAt && (
            <InfoCard icon={Calendar} title="Scheduled">
              <p className="text-sm">{formatDate(complaint.scheduledAt)}</p>
            </InfoCard>
          )}
          {complaint.resolvedAt && (
            <InfoCard icon={CheckCircle} title="Resolved">
              <p className="text-sm">{formatDate(complaint.resolvedAt)}</p>
            </InfoCard>
          )}
        </div>

        {complaint.images && complaint.images.length > 0 && (
          <InfoCard icon={ImageIcon} title="Complaint Images">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {complaint.images.map((img, idx) => (
                <button
                  key={img.uri}
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
          </InfoCard>
        )}

        {complaint.resolutionDetails && (
          <InfoCard icon={CheckCircle} title="Resolution Details">
            <p className="text-sm mb-2">{complaint.resolutionDetails.description}</p>
            {complaint.resolutionDetails.budget && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Budget: ₱{complaint.resolutionDetails.budget.toLocaleString()}
              </p>
            )}
            {complaint.resolutionDetails.images && complaint.resolutionDetails.images.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Resolution Image:</p>
                <button
                  onClick={() => setSelectedImage(complaint.resolutionDetails!.images![0].uri)}
                  className="group relative aspect-square w-48 border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={complaint.resolutionDetails.images[0].uri}
                    alt="Resolution image"
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              </div>
            )}
          </InfoCard>
        )}
      </div>
      
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-4xl w-full p-0 overflow-hidden border-0">
          <DialogTitle className="sr-only">Complaint Image</DialogTitle>
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

import { TabsContent } from "@/components/ui/tabs";
import { FileText, Calendar, DollarSign, Briefcase, Wallet, ImageIcon, TrendingUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import InfoCard from "@/components/ui/info-card";
import { useState } from "react";
import type { ProjectType } from "@/types/project";
import { formatBudget } from "@/lib/project-helpers";
import { formatDate } from "@/lib/date-formatter";
import Image from "next/image";

interface ProjectDetailsTabProps {
  project: ProjectType;
}

export default function ProjectDetailsTab({ project }: ProjectDetailsTabProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <TabsContent value="details" className="space-y-4 p-6">
      <div className="space-y-4">
        <InfoCard icon={FileText} title="Description">
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </InfoCard>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoCard icon={Calendar} title="Start Date">
            <p className="text-sm">{formatDate(project.startDate)}</p>
          </InfoCard>
          {project.expectedCompletionDate && (
            <InfoCard icon={Calendar} title="Expected Completion">
              <p className="text-sm">{formatDate(project.expectedCompletionDate)}</p>
            </InfoCard>
          )}
          {project.actualCompletionDate && (
            <InfoCard icon={Calendar} title="Actual Completion">
              <p className="text-sm">{formatDate(project.actualCompletionDate)}</p>
            </InfoCard>
          )}
          <InfoCard icon={Calendar} title="Created">
            <p className="text-sm">{formatDate(project.createdAt)}</p>
          </InfoCard>
        </div>

        {(project.budget || project.contractor || project.sourceOfFunds) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={DollarSign} title="Budget">
              <p className="text-sm font-medium">{formatBudget(project.budget)}</p>
            </InfoCard>
            {project.contractor && (
              <InfoCard icon={Briefcase} title="Contractor">
                <p className="text-sm">{project.contractor}</p>
              </InfoCard>
            )}
            {project.sourceOfFunds && (
              <InfoCard icon={Wallet} title="Source of Funds">
                <p className="text-sm">{project.sourceOfFunds}</p>
              </InfoCard>
            )}
          </div>
        )}

        {project.images && project.images.length > 0 && (
          <InfoCard icon={ImageIcon} title="Project Images">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {project.images.map((img, idx) => (
                <button
                  key={img.uri}
                  onClick={() => setSelectedImage(img.uri)}
                  className="group relative aspect-square border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Image
                    src={img.uri}
                    alt={`Project image ${idx + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </button>
              ))}
            </div>
          </InfoCard>
        )}

        {project.progressUpdates && project.progressUpdates.length > 0 && (
          <InfoCard icon={TrendingUp} title="Progress Updates">
            <div className="space-y-4">
              {project.progressUpdates.map((update, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-4 pb-4 last:pb-0">
                  <p className="text-sm text-muted-foreground mb-1">
                    {formatDate(update.createdAt)}
                  </p>
                  {update.description && (
                    <p className="text-sm">{update.description}</p>
                  )}
                  {update.image && (
                    <button
                      onClick={() => setSelectedImage(update.image!.uri)}
                      className="mt-2 relative w-full max-w-xs aspect-video border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    >
                      <Image
                        src={update.image.uri}
                        alt="Progress update"
                        fill
                        className="object-cover"
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </InfoCard>
        )}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-4xl w-full p-0 overflow-hidden border-0 ">
          <DialogTitle className="sr-only">Project Image</DialogTitle>
          <div className="relative">
            <DialogClose className="absolute top-1.5 right-1.5 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white">
              <X className="h-5 w-5" />
            </DialogClose>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Full size preview"
                width={1280}
                height={720}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}

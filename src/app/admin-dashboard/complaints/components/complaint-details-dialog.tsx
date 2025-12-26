import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, ThumbsUp, MessageSquare, Sparkles } from "lucide-react";
import type { Complaint, ComplaintStatus, ComplaintCategory } from "@/contexts/complaint-db-context";

interface ComplaintDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: Complaint | null;
  getStatusBadge: (status: ComplaintStatus) => { className: string; label: string };
  getPriorityBadge: (priority: string) => string;
  getCategoryLabel: (category: ComplaintCategory) => string;
  getCategoryBadge: (category: ComplaintCategory) => string;
  formatDate: (date: Date) => string;
  handleStatusChange: (complaintId: string, newStatus: ComplaintStatus) => void;
  adminComment: string;
  setAdminComment: (value: string) => void;
  handleAddAdminComment: () => void;
  handleGenerateAIAnalysis: (complaintId: string) => void;
}

export function ComplaintDetailsDialog({
  isOpen,
  onOpenChange,
  complaint,
  getStatusBadge,
  getPriorityBadge,
  getCategoryLabel,
  getCategoryBadge,
  formatDate,
  handleStatusChange,
  adminComment,
  setAdminComment,
  handleAddAdminComment,
  handleGenerateAIAnalysis,
}: ComplaintDetailsDialogProps) {
  if (!complaint) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{complaint.title}</DialogTitle>
          <DialogDescription>
            Complaint ID: {complaint.id}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusBadge(complaint.status).className}>
                  {getStatusBadge(complaint.status).label}
                </Badge>
                <Badge className={getPriorityBadge(complaint.priority)}>
                  {complaint.priority.toUpperCase()}
                </Badge>
                <Badge className={getCategoryBadge(complaint.category)}>
                  {getCategoryLabel(complaint.category)}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {complaint.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Complainant</h4>
                  <p className="text-sm">{complaint.complainantName}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Submitted</h4>
                  <p className="text-sm">{formatDate(complaint.createdAt)}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Last Updated</h4>
                  <p className="text-sm">{formatDate(complaint.updatedAt)}</p>
                </div>
                {complaint.resolvedAt && (
                  <div>
                    <h4 className="font-semibold mb-1">Resolved</h4>
                    <p className="text-sm">{formatDate(complaint.resolvedAt)}</p>
                  </div>
                )}
              </div>

              {complaint.images && complaint.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Images</h4>
                  <div className="space-y-2">
                    {complaint.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="border rounded-lg p-3 text-sm text-muted-foreground w-full"
                      >
                        Image {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {complaint.resolutionDetails && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Resolution Details</h4>
                  <p className="text-sm mb-2">
                    {complaint.resolutionDetails.description}
                  </p>
                  {complaint.resolutionDetails.budget && (
                    <p className="text-sm text-muted-foreground">
                      Budget: ₱{complaint.resolutionDetails.budget.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Coordinates
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Latitude:</span>{" "}
                  {complaint.location.latitude}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Longitude:</span>{" "}
                  {complaint.location.longitude}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps?q=${complaint.location.latitude},${complaint.location.longitude}`,
                      "_blank"
                    );
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Google Maps
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {complaint.likes?.length || 0} likes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {complaint.comments?.length || 0} comments
                  </span>
                </div>
              </div>

              {/* Admin Comment Form */}
              <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
                <h4 className="font-semibold text-sm">Add Admin Comment</h4>
                <Textarea
                  placeholder="Type your comment as admin..."
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleAddAdminComment}
                  disabled={!adminComment.trim()}
                  size="sm"
                >
                  Post Comment
                </Button>
              </div>

              {complaint.comments && complaint.comments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Comments</h4>
                  <div className="space-y-3">
                    {complaint.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`border rounded-lg p-3 space-y-2 ${
                          comment.isAdmin ? "bg-primary/5 border-primary/20" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {comment.userName}
                            </span>
                            {comment.isAdmin && (
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {comment.likes?.length || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            onClick={() => handleGenerateAIAnalysis(complaint.id)}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Generate AI Analysis
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Select
              value={complaint.status}
              onValueChange={(value) =>
                handleStatusChange(complaint.id, value as ComplaintStatus)
              }
            >
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

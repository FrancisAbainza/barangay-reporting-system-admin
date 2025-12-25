import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { ThumbsUp, MessageSquare, Send } from "lucide-react";
import type { Complaint } from "@/contexts/complaint-db-context";

interface ComplaintEngagementTabProps {
  complaint: Complaint;
  adminComment: string;
  onAdminCommentChange: (value: string) => void;
  onAddComment: () => void;
  formatDate: (date: Date) => string;
}

export function ComplaintEngagementTab({
  complaint,
  adminComment,
  onAdminCommentChange,
  onAddComment,
  formatDate,
}: ComplaintEngagementTabProps) {
  return (
    <TabsContent value="engagement" className="space-y-4 p-6">
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{complaint.likes?.length || 0} likes</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{complaint.comments?.length || 0} comments</span>
          </div>
        </div>

        {/* Admin Comment Form */}
        <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Send className="h-4 w-4" />
            Add Admin Comment
          </h4>
          <Textarea
            placeholder="Type your comment as admin..."
            value={adminComment}
            onChange={(e) => onAdminCommentChange(e.target.value)}
            rows={3}
          />
          <Button onClick={onAddComment} disabled={!adminComment.trim()} size="sm" className="gap-2">
            <Send className="h-4 w-4" />
            Post Comment
          </Button>
        </div>

        {complaint.comments && complaint.comments.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </h4>
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
                      <span className="font-medium text-sm">{comment.userName}</span>
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
  );
}

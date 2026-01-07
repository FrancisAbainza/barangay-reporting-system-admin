"use client";

import { useComplaintDb } from "@/contexts/complaint-db-context";
import { TabsContent } from "@/components/ui/tabs";
import { AdminCommentForm } from "@/components/admin-comment-form";
import { CommentsList } from "@/components/comments-list";
import { CommunitySentimentCard } from "@/components/community-sentiment-card";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import type { ComplaintType } from "@/types/complaint";

interface ComplaintEngagementTabProps {
  complaint: ComplaintType;
}

export function ComplaintEngagementTab({ complaint }: ComplaintEngagementTabProps) {
  const { addComplaintComment, addReply, generateCommunitySentiment } = useComplaintDb();

  const handleSubmitComment = (content: string) => {
    addComplaintComment(complaint.id, "admin1", "Admin Staff", content, true);
  };

  const handleSubmitReply = (commentId: string, content: string) => {
    addReply(complaint.id, commentId, "admin1", "Admin Staff", content, true);
  };

  const renderEngagementStats = () => (
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{complaint.likes?.length || 0} likes</span>
      </div>
      <div className="flex items-center gap-2">
        <ThumbsDown className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{complaint.dislikes?.length || 0} dislikes</span>
      </div>
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{complaint.comments?.length || 0} comments</span>
      </div>
    </div>
  );



  return (
    <TabsContent value="engagement" className="space-y-4 p-6">
      <div className="space-y-4">
        <CommunitySentimentCard
          item={complaint}
          onGenerate={generateCommunitySentiment}
        />

        {renderEngagementStats()}
        <AdminCommentForm onSubmit={handleSubmitComment} />
        {complaint.comments && complaint.comments.length > 0 && (
          <CommentsList comments={complaint.comments} onSubmitReply={handleSubmitReply} />
        )}
      </div>
    </TabsContent>
  );
}

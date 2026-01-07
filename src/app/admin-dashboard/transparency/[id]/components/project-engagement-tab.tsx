"use client";

import { useProjectDb } from "@/contexts/project-db-context";
import { TabsContent } from "@/components/ui/tabs";
import { AdminCommentForm } from "@/components/admin-comment-form";
import { CommentsList } from "@/components/comments-list";
import { CommunitySentimentCard } from "@/components/community-sentiment-card";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import type { ProjectType } from "@/types/project";

interface ProjectEngagementTabProps {
  project: ProjectType;
}

export function ProjectEngagementTab({ project }: ProjectEngagementTabProps) {
  const { addProjectComment, addReply, generateCommunitySentiment } = useProjectDb();

  const handleSubmitComment = (content: string) => {
    addProjectComment(project.id, "admin1", "Admin Staff", content, true);
  };

  const handleSubmitReply = (commentId: string, content: string) => {
    addReply(project.id, commentId, "admin1", "Admin Staff", content, true);
  };

  const renderEngagementStats = () => (
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{project.likes?.length || 0} likes</span>
      </div>
      <div className="flex items-center gap-2">
        <ThumbsDown className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{project.dislikes?.length || 0} dislikes</span>
      </div>
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{project.comments?.length || 0} comments</span>
      </div>
    </div>
  );

  return (
    <TabsContent value="engagement" className="space-y-4 p-6">
      <div className="space-y-4">
        <CommunitySentimentCard
          item={project}
          onGenerate={generateCommunitySentiment}
        />

        {renderEngagementStats()}
        <AdminCommentForm onSubmit={handleSubmitComment} />
        {project.comments && project.comments.length > 0 && (
          <CommentsList comments={project.comments} onSubmitReply={handleSubmitReply} />
        )}
      </div>
    </TabsContent>
  );
}

"use client";

import { useProjectDb } from "@/contexts/project-db-context";
import { useAuth } from "@/contexts/auth-context";
import { TabsContent } from "@/components/ui/tabs";
import AdminCommentForm from "@/components/admin-comment-form";
import CommentsList from "@/components/comments-list";
import CommunitySentimentCard from "@/components/community-sentiment-card";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import type { ProjectType } from "@/types/project";

interface ProjectEngagementTabProps {
  project: ProjectType;
}

export default function ProjectEngagementTab({ project }: ProjectEngagementTabProps) {
  const { addProjectComment, addReply, generateCommunitySentiment } = useProjectDb();
  const { user } = useAuth();

  const handleSubmitComment = (content: string) => {
    addProjectComment(project.id, user?.id || "", user?.name || "", content, true);
  };

  const handleSubmitReply = (commentId: string, content: string) => {
    addReply(project.id, commentId, user?.id || "", user?.name || "", content, true);
  };

  return (
    <TabsContent value="engagement" className="space-y-4 p-6">
      <div className="space-y-4">
        <CommunitySentimentCard
          item={project}
          onGenerate={generateCommunitySentiment}
        />

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
        
        <AdminCommentForm onSubmit={handleSubmitComment} />
        {project.comments && project.comments.length > 0 && (
          <CommentsList comments={project.comments} onSubmitReply={handleSubmitReply} />
        )}
      </div>
    </TabsContent>
  );
}

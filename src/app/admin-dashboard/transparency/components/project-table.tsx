import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ThumbsUp, MessageSquare, Trash2 } from "lucide-react";
import type { Project, ProjectStatus, ProjectCategory } from "@/types/project";
import { formatBudget } from "@/lib/project-helpers";

interface ProjectTableProps {
  projects: Project[];
  getStatusBadge: (status: ProjectStatus) => { className: string; label: string };
  getCategoryLabel: (category: ProjectCategory) => string;
  getCategoryBadge: (category: ProjectCategory) => string;
  formatDate: (date: Date) => string;
  handleStatusChange: (projectId: string, newStatus: ProjectStatus) => void;
  handleDeleteProject: (projectId: string) => void;
}

export function ProjectTable({
  projects,
  getStatusBadge,
  getCategoryLabel,
  getCategoryBadge,
  formatDate,
  handleStatusChange,
  handleDeleteProject,
}: ProjectTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-50">Title</TableHead>
            <TableHead className="min-w-32.5">Category</TableHead>
            <TableHead className="min-w-30">Status</TableHead>
            <TableHead className="min-w-25">Budget</TableHead>
            <TableHead className="min-w-30">Progress</TableHead>
            <TableHead className="min-w-35">Start Date</TableHead>
            <TableHead className="min-w-30">Engagement</TableHead>
            <TableHead className="text-right min-w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No projects found
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow 
                key={project.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/admin-dashboard/transparency/${project.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="truncate max-w-62.5">{project.title}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryBadge(project.category)}>
                    {getCategoryLabel(project.category)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(project.status).className}>
                    {getStatusBadge(project.status).label}
                  </Badge>
                </TableCell>
                <TableCell>{formatBudget(project.budget)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {project.progressPercentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(project.startDate)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {project.likes?.length || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {project.comments?.length || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(project.id, "planned")}
                      >
                        Planned
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(project.id, "approved")}
                      >
                        Approved
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(project.id, "ongoing")}
                      >
                        Ongoing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(project.id, "on_hold")}
                      >
                        On Hold
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(project.id, "completed")}
                      >
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(project.id, "cancelled")}
                      >
                        Cancelled
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

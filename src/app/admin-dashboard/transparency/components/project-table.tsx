"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { MoreVertical, ThumbsUp, MessageSquare, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import type { ProjectType } from "@/types/project";
import { formatBudget } from "@/lib/project-helpers";
import { formatDate } from "@/lib/date-formatter";
import EditProjectMenuItem from "./edit-project-menu-item";
import UpdateProgressMenuItem from "./update-progress-menu-item";
import DeleteMenuItem from "@/app/admin-dashboard/complaints/components/delete-menu-item";
import CategoryBadge from "@/components/badges/category-badge";
import StatusBadge from "@/components/badges/status-badge";
import { useProjectDb } from "@/contexts/project-db-context";

interface ProjectTableProps {
  projects: ProjectType[];
}



export default function ProjectTable({
  projects,
}: ProjectTableProps) {
  const router = useRouter();
  const { deleteProject } = useProjectDb();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    toast.success("Project deleted successfully");
  };

  // Sort by createdAt (newest first) and paginate
  const { paginatedProjects, totalPages } = useMemo(() => {
    const sorted = [...projects].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const total = Math.ceil(sorted.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = sorted.slice(startIndex, startIndex + itemsPerPage);
    return { paginatedProjects: paginated, totalPages: total };
  }, [projects, currentPage]);

  return (
    <div className="space-y-4">
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
          {paginatedProjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No projects found
              </TableCell>
            </TableRow>
          ) : (
            paginatedProjects.map((project) => (
              <TableRow
                key={project.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/admin-dashboard/transparency/${project.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="truncate max-w-62.5">{project.title}</div>
                </TableCell>
                <TableCell>
                  <CategoryBadge type="project" category={project.category} />
                </TableCell>
                <TableCell>
                  <StatusBadge type="project" status={project.status} />
                </TableCell>
                <TableCell>{formatBudget(project.budget)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progressPercentage} className="w-20" />
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
                      <ThumbsDown className="h-3 w-3" />
                      {project.dislikes?.length || 0}
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <UpdateProgressMenuItem project={project} />
                      <EditProjectMenuItem project={project} />
                      <DropdownMenuSeparator />
                      <DeleteMenuItem
                        onDelete={() => handleDeleteProject(project.id)}
                        description="This action cannot be undone. This will permanently delete the project and remove it from the system."
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

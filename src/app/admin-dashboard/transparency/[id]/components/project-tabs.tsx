"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MapPin, MessageSquare } from "lucide-react";
import { ProjectDetailsTab } from "./project-details-tab";
import { ProjectLocationTab } from "./project-location-tab";
import { ProjectEngagementTab } from "./project-engagement-tab";
import { ProjectType } from "@/types/project";

interface ProjectTabsProps {
  project: ProjectType;
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Location</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Engagement</span>
          </TabsTrigger>
        </TabsList>

        <ProjectDetailsTab project={project} />
        <ProjectLocationTab project={project} />
        <ProjectEngagementTab project={project} />
      </Tabs>
    </Card>
  );
}

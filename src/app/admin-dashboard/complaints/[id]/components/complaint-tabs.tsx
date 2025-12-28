"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MapPin, MessageSquare, Sparkles } from "lucide-react";
import { ComplaintDetailsTab } from "./complaint-details-tab";
import { ComplaintLocationTab } from "./complaint-location-tab";
import { ComplaintEngagementTab } from "./complaint-engagement-tab";
import { ComplaintAIAnalysisTab } from "./complaint-ai-analysis-tab";
import { Complaint } from "@/types/complaint";

interface ComplaintTabsProps {
  complaint: Complaint;
}

export function ComplaintTabs({ complaint }: ComplaintTabsProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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
          <TabsTrigger value="ai-analysis" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">AI Analysis</span>
          </TabsTrigger>
        </TabsList>

        <ComplaintDetailsTab complaint={complaint} />
        <ComplaintLocationTab complaint={complaint} />
        <ComplaintEngagementTab complaint={complaint} />
        <ComplaintAIAnalysisTab complaint={complaint} />
      </Tabs>
    </Card>
  );
}

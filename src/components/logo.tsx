import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn(
      "flex items-center justify-center rounded-lg p-3 bg-primary text-primary-foreground",
      className
    )}>
      <ShieldCheck />
    </div>
  );
}
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface InfoCardProps {
  icon?: LucideIcon;
  iconClassName?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function InfoCard({
  icon: Icon,
  iconClassName = "text-primary",
  title,
  children,
  className = "",
}: InfoCardProps) {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <h4 className="font-semibold mb-2 flex items-center gap-2">
        {Icon && <Icon className={`h-4 w-4 ${iconClassName}`} />}
        {title}
      </h4>
      {children}
    </div>
  );
}

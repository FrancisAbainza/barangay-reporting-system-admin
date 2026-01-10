import { AlertCircle, FolderKanban } from "lucide-react";

export default function DataIcon({type}: {type: "complaint" | "project"}) {
  return (
    <div
      className={`mt-1 rounded-full p-2 ${type === "complaint" ? "bg-blue-50" : "bg-purple-50"
        }`}
    >
      {type === "complaint" ? (
        <AlertCircle className="h-4 w-4 text-blue-500" />
      ) : (
        <FolderKanban className="h-4 w-4 text-purple-500" />
      )}
    </div>
  );
}
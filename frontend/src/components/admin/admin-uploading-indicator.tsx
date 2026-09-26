"use client";

import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type AdminUploadingIndicatorProps = {
  progress?: number;
  className?: string;
};

export function AdminUploadingIndicator({ progress = 0, className }: AdminUploadingIndicatorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-blue-600 admin-dark:text-blue-400">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        <span>Uploading{progress > 0 ? `... ${progress}%` : "..."}</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}

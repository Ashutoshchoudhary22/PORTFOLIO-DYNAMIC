"use client";

import type { LucideIcon } from "lucide-react";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconClassName?: string;
  quote?: string;
  quoteEmoji?: string;
  className?: string;
};

export function AdminPageHeader({
  title,
  description,
  icon: Icon,
  iconClassName = "bg-blue-50 text-blue-600 admin-dark:bg-blue-900/30 admin-dark:text-blue-400",
  quote = "Small steps every day lead to big results.",
  quoteEmoji = "🌿",
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4", className)}>
      <div className="flex items-start gap-4 min-w-0">
        {Icon ? (
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              iconClassName
            )}
          >
            <Icon className="h-6 w-6" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          <p className={cn("mt-1 text-sm sm:text-base", adminMutedClass)}>{description}</p>
        </div>
      </div>

      <div
        className={`${adminCardClass} flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-white to-blue-50/80 p-4 sm:p-5 admin-dark:from-slate-900 admin-dark:to-slate-900`}
      >
        <p className="text-sm sm:text-base italic text-slate-600 admin-dark:text-white/70">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="hidden shrink-0 text-4xl opacity-80 sm:block" aria-hidden>
          {quoteEmoji}
        </div>
      </div>
    </div>
  );
}

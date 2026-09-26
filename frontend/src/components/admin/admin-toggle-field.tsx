"use client";

import { Switch } from "@/components/ui/switch";
import { adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type AdminToggleFieldProps = {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function AdminToggleField({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  className,
}: AdminToggleFieldProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/90 to-white px-4 py-3.5 transition-all duration-200",
        "hover:border-blue-100 hover:shadow-sm hover:shadow-blue-500/5",
        "admin-dark:border-white/10 admin-dark:from-slate-800/60 admin-dark:to-slate-800/40 admin-dark:hover:border-blue-500/20",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 admin-dark:text-slate-100">{label}</p>
        {description && (
          <p className={cn("text-xs mt-0.5 leading-relaxed", adminMutedClass)}>{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span
          className={cn(
            "hidden sm:inline text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200",
            checked
              ? "text-blue-600 admin-dark:text-blue-400"
              : "text-slate-400 admin-dark:text-slate-500"
          )}
          aria-hidden
        >
          {checked ? "On" : "Off"}
        </span>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-label={label}
        />
      </div>
    </div>
  );
}

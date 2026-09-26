"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAdminTheme } from "@/components/admin/admin-theme-provider";
import { adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type AdminThemeToggleProps = {
  showLabel?: boolean;
  variant?: "button" | "switch";
  className?: string;
};

export function AdminThemeToggle({
  showLabel = false,
  variant = "button",
  className,
}: AdminThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";

  if (variant === "switch") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/90 to-white px-3 py-2.5 transition-all duration-200",
          "hover:border-blue-100 hover:shadow-sm hover:shadow-blue-500/5",
          "admin-dark:border-white/10 admin-dark:from-slate-800/60 admin-dark:to-slate-800/40 admin-dark:hover:border-blue-500/20",
          className
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {isDark ? (
            <Moon className="h-4 w-4 shrink-0 text-indigo-400" />
          ) : (
            <Sun className="h-4 w-4 shrink-0 text-amber-500" />
          )}
          <span className={cn("text-sm font-medium truncate", adminMutedClass)}>Dark mode</span>
        </div>
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle dark mode"
        />
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={showLabel ? "default" : "icon"}
      className={className}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {showLabel && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
    </Button>
  );
}

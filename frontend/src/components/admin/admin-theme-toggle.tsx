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
  const isLight = theme === "light";

  if (variant === "switch") {
    return (
      <div className={cn("flex items-center justify-between gap-3", className)}>
        <span className={cn("text-sm", adminMutedClass)}>
          {isLight ? "Light mode" : "Dark mode"}
        </span>
        <Switch
          checked={isLight}
          onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-slate-200 admin-dark:data-[state=unchecked]:bg-slate-700"
          aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
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

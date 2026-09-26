import Link from "next/link";
import { ArrowRight, Award, Briefcase, FolderKanban, Star } from "lucide-react";
import { adminCardClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/admin/projects",
    label: "Add Project",
    icon: FolderKanban,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    href: "/admin/skills",
    label: "Update Skills",
    icon: Star,
    iconClass: "bg-emerald-100 text-emerald-600",
  },
  {
    href: "/admin/certifications",
    label: "Add Certification",
    icon: Award,
    iconClass: "bg-pink-100 text-pink-600",
  },
  {
    href: "/admin/experience",
    label: "Edit Experience",
    icon: Briefcase,
    iconClass: "bg-violet-100 text-violet-600",
  },
];

export function QuickActions() {
  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3.5 transition-colors hover:bg-slate-100 admin-dark:border-white/10 admin-dark:bg-slate-800/50 admin-dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                    action.iconClass
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium text-sm sm:text-base">{action.label}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

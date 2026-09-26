"use client";

import { usePathname } from "next/navigation";
import { Bell, Calendar, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminMutedClass, adminTopbarClass } from "@/lib/admin-styles";

type AdminTopbarProps = {
  adminName?: string;
};

function getSearchPlaceholder(pathname: string) {
  if (pathname.startsWith("/admin/settings")) return "Search settings...";
  if (pathname.startsWith("/admin/backgrounds")) return "Search backgrounds...";
  if (pathname.startsWith("/admin/skills")) return "Search skills...";
  if (pathname.startsWith("/admin/experience")) return "Search experiences...";
  if (pathname.startsWith("/admin/education")) return "Search education...";
  if (pathname.startsWith("/admin/certifications")) return "Search certifications...";
  if (pathname.startsWith("/admin/projects")) return "Search projects...";
  if (pathname.startsWith("/admin/services")) return "Search services...";
  if (pathname.startsWith("/admin/messages")) return "Search messages...";
  return "Search anything...";
}

export function AdminTopbar({ adminName = "Admin" }: AdminTopbarProps) {
  const pathname = usePathname();
  const searchPlaceholder = getSearchPlaceholder(pathname);
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className={`hidden md:block ${adminTopbarClass}`}>
      <div className="flex w-full items-center gap-4 px-6 py-4">
        <div className="w-full max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 h-11 rounded-full bg-slate-50 border-slate-200 admin-dark:bg-slate-800 admin-dark:border-white/10"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 shrink-0">
          <button
            type="button"
            className="relative h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 admin-dark:border-white/10 admin-dark:bg-slate-800 admin-dark:hover:bg-slate-700"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white admin-dark:ring-slate-900" />
          </button>

          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 admin-dark:bg-slate-800">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{today}</span>
              <span className={`text-xs ${adminMutedClass}`}>Last updated</span>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50 admin-dark:border-white/10 admin-dark:bg-slate-800 admin-dark:hover:bg-slate-700"
          >
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-sm font-semibold flex items-center justify-center">
              {adminName.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-medium pr-1 hidden lg:inline">{adminName}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}

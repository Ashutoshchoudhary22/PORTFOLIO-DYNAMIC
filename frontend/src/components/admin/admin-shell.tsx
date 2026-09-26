"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Star,
  Briefcase,
  GraduationCap,
  Award,
  FolderKanban,
  Wrench,
  Mail,
  LogOut,
  ImageIcon,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AdminBrand } from "@/components/admin/admin-brand";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";
import { adminApi } from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
import {
  adminBorderClass,
  adminHeaderClass,
  adminNavActiveClass,
  adminNavInactiveClass,
  adminSheetClass,
  adminSheetTitleClass,
  adminSidebarClass,
} from "@/lib/admin-styles";
import { Spinner } from "@/components/loading";
import type { AdminUser } from "@/lib/types";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/backgrounds", label: "Backgrounds", icon: ImageIcon },
  { href: "/admin/skills", label: "Skills", icon: Star },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

function AdminNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1 shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              active
                ? `${adminNavActiveClass} before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-7 before:w-1 before:rounded-r-full before:bg-blue-500 admin-dark:before:bg-white/70`
                : adminNavInactiveClass
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    adminApi
      .getMe(token)
      .then((user) => {
        setAdminUser(user);
        setChecking(false);
      })
      .catch(() => {
        clearAdminToken();
        router.replace("/admin/login");
      });
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const token = getAdminToken();
    if (token) {
      try {
        await adminApi.logout(token);
      } catch {
        // ignore logout errors
      }
    }
    clearAdminToken();
    router.replace("/admin/login");
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const adminName = adminUser?.name || "Admin";

  return (
    <div className="h-screen flex overflow-hidden">
      <aside
        className={`w-64 h-screen border-r p-4 hidden md:flex flex-col shrink-0 overflow-hidden shadow-sm ${adminSidebarClass}`}
      >
        <div className="mb-6 px-1 shrink-0">
          <AdminBrand />
        </div>
        <AdminNav pathname={pathname} />
        <div className="mt-auto shrink-0 space-y-4 pt-4 border-t border-slate-100 admin-dark:border-white/10">
          <AdminThemeToggle variant="switch" />
          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${adminNavInactiveClass}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
        <div className="shrink-0">
          <AdminTopbar adminName={adminName} />
        </div>

        <div className={`md:hidden shrink-0 z-40 ${adminHeaderClass}`}>
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 rounded-full"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <AdminBrand compact />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AdminThemeToggle />
              <Button size="sm" variant="outline" className="rounded-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className={`w-[min(100vw-2rem,18rem)] p-0 flex flex-col ${adminSheetClass}`}
          >
            <SheetHeader className={`p-4 border-b text-left space-y-3 ${adminBorderClass}`}>
              <AdminBrand />
              <SheetTitle className={`sr-only ${adminSheetTitleClass}`}>Control Panel</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col flex-1 p-4 overflow-y-auto">
              <AdminNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <div className="mt-4 space-y-4 pt-4 border-t border-slate-100 admin-dark:border-white/10">
                <AdminThemeToggle variant="switch" />
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${adminNavInactiveClass}`}
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

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
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";
import { adminApi } from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
import {
  adminBorderClass,
  adminHeaderClass,
  adminMutedClass,
  adminNavActiveClass,
  adminNavInactiveClass,
  adminSheetClass,
  adminSheetTitleClass,
} from "@/lib/admin-styles";
import { Spinner } from "@/components/loading";

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
    <nav className="space-y-1 flex-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
              active ? adminNavActiveClass : adminNavInactiveClass
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

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    adminApi
      .getMe(token)
      .then(() => setChecking(false))
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

  return (
    <div className="min-h-screen flex">
      <aside className={`w-64 border-r ${adminBorderClass} p-4 hidden md:flex flex-col shrink-0`}>
        <div className="mb-8">
          <p className={`text-sm ${adminMutedClass}`}>Portfolio Admin</p>
          <h1 className="text-xl font-bold">Control Panel</h1>
        </div>
        <AdminNav pathname={pathname} />
        <div className="mt-4 space-y-2">
          <AdminThemeToggle showLabel className="w-full justify-start" />
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <div className={`md:hidden sticky top-0 z-40 ${adminHeaderClass}`}>
          <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="min-w-0">
                <p className={`text-xs truncate ${adminMutedClass}`}>Portfolio Admin</p>
                <p className="font-semibold truncate">Control Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <AdminThemeToggle />
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className={`w-[min(100vw-2rem,18rem)] p-0 flex flex-col ${adminSheetClass}`}
          >
            <SheetHeader className={`p-4 border-b text-left space-y-1 ${adminBorderClass}`}>
              <SheetTitle className={adminSheetTitleClass}>Control Panel</SheetTitle>
              <p className={`text-sm ${adminMutedClass}`}>Portfolio Admin</p>
            </SheetHeader>
            <div className="flex flex-col flex-1 p-4 overflow-y-auto">
              <AdminNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <div className="mt-4 space-y-2">
                <AdminThemeToggle showLabel className="w-full justify-start" />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="p-3 sm:p-4 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}

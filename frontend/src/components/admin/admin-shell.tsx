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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
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

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-64 border-r border-white/10 p-4 hidden md:flex flex-col">
        <div className="mb-8">
          <p className="text-sm text-white/60">Portfolio Admin</p>
          <h1 className="text-xl font-bold">Control Panel</h1>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button variant="outline" className="mt-4" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden border-b border-white/10 p-4 flex items-center justify-between">
          <p className="font-semibold">Admin Panel</p>
          <Button size="sm" variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

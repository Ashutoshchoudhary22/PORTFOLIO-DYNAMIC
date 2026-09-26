"use client";

import { useEffect, useState } from "react";
import {
  Award,
  Briefcase,
  FolderKanban,
  Mail,
  MailOpen,
  Star,
  Wrench,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardStatCard } from "@/components/admin/dashboard/stat-card";
import { PortfolioOverview } from "@/components/admin/dashboard/portfolio-overview";
import { RecentMessagesPanel } from "@/components/admin/dashboard/recent-messages-panel";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import type { AdminUser, DashboardStats } from "@/lib/types";
import { Spinner } from "@/components/loading";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;

    Promise.all([adminApi.getDashboard(token), adminApi.getMe(token)])
      .then(([dashboard, user]) => {
        setData(dashboard);
        setAdminUser(user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AdminShell>
    );
  }

  const stats = data?.stats;
  const adminName = adminUser?.name || "Admin";

  const cards = [
    { label: "Total Projects", value: stats?.totalProjects ?? 0, icon: FolderKanban, color: "blue" as const },
    { label: "Published Projects", value: stats?.publishedProjects ?? 0, icon: FolderKanban, color: "purple" as const },
    { label: "Skills", value: stats?.totalSkills ?? 0, icon: Star, color: "green" as const },
    { label: "Experience", value: stats?.totalExperience ?? 0, icon: Briefcase, color: "orange" as const },
    { label: "Certifications", value: stats?.totalCertifications ?? 0, icon: Award, color: "pink" as const },
    { label: "Messages", value: stats?.totalMessages ?? 0, icon: Mail, color: "cyan" as const },
    { label: "Unread Messages", value: stats?.unreadMessages ?? 0, icon: MailOpen, color: "indigo" as const },
    { label: "Services", value: stats?.totalServices ?? 0, icon: Wrench, color: "teal" as const },
  ];

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {adminName} 👋
            </h1>
            <p className={`mt-1 text-sm sm:text-base ${adminMutedClass}`}>
              Here&apos;s what&apos;s happening with your portfolio today.
            </p>
          </div>

          <div
            className={`${adminCardClass} rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 bg-gradient-to-r from-white to-blue-50/80 admin-dark:from-slate-900 admin-dark:to-slate-900`}
          >
            <p className="text-sm sm:text-base text-slate-600 italic admin-dark:text-white/70">
              &ldquo;Small steps every day lead to big results.&rdquo;
            </p>
            <div className="hidden sm:block shrink-0 text-4xl opacity-80" aria-hidden>
              🌿
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => (
            <DashboardStatCard
              key={card.label}
              label={card.label}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 sm:gap-6">
          <PortfolioOverview
            skills={stats?.totalSkills ?? 0}
            projects={stats?.totalProjects ?? 0}
            certifications={stats?.totalCertifications ?? 0}
          />

          <div className="space-y-4 sm:space-y-6">
            <RecentMessagesPanel messages={data?.recentMessages || []} />
            <QuickActions />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { DashboardStats } from "@/lib/types";
import { Spinner } from "@/components/loading";
import { adminBorderClass, adminCardClass, adminMutedClass, adminSubtleClass } from "@/lib/admin-styles";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;

    adminApi
      .getDashboard(token)
      .then(setData)
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

  const cards = [
    { label: "Total Projects", value: stats?.totalProjects ?? 0 },
    { label: "Published Projects", value: stats?.publishedProjects ?? 0 },
    { label: "Skills", value: stats?.totalSkills ?? 0 },
    { label: "Experience", value: stats?.totalExperience ?? 0 },
    { label: "Certifications", value: stats?.totalCertifications ?? 0 },
    { label: "Messages", value: stats?.totalMessages ?? 0 },
    { label: "Unread Messages", value: stats?.unreadMessages ?? 0 },
    { label: "Services", value: stats?.totalServices ?? 0 },
  ];

  return (
    <AdminShell>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
          <p className={`text-sm sm:text-base ${adminMutedClass}`}>Portfolio content overview</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => (
            <Card key={card.label} className={adminCardClass}>
              <CardHeader className="pb-1 sm:pb-2 p-4 sm:p-6">
                <CardTitle className={`text-xs sm:text-sm leading-snug ${adminSubtleClass}`}>
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recentMessages || []).length === 0 ? (
              <p className={adminMutedClass}>No messages yet.</p>
            ) : (
              data?.recentMessages.map((message) => (
                <div
                  key={message._id}
                  className={`border rounded-md p-3 sm:p-4 break-words ${adminBorderClass}`}
                >
                  <p className="font-medium">{message.name}</p>
                  <p className={`text-sm break-all ${adminMutedClass}`}>{message.email}</p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{message.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

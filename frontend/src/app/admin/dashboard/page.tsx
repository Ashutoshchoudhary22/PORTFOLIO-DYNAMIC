"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { DashboardStats } from "@/lib/types";
import { Spinner } from "@/components/loading";

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
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-white/60">Portfolio content overview</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card key={card.label} className="bg-slate-900 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/70">{card.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recentMessages || []).length === 0 ? (
              <p className="text-white/60">No messages yet.</p>
            ) : (
              data?.recentMessages.map((message) => (
                <div key={message._id} className="border border-white/10 rounded-md p-3">
                  <p className="font-medium">{message.name}</p>
                  <p className="text-sm text-white/60">{message.email}</p>
                  <p className="text-sm mt-2">{message.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

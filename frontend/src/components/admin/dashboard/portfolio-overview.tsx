"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, FolderKanban, Star, Award } from "lucide-react";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type PortfolioOverviewProps = {
  skills: number;
  projects: number;
  certifications: number;
};

function buildChartData(skills: number, projects: number, certifications: number) {
  const days = 25;
  const now = new Date();

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - 1 - i));
    const progress = (i + 1) / days;

    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      skills: Math.max(0, Math.round(skills * progress * 0.85 + i * 0.2)),
      projects: Math.max(0, Math.round(projects * progress * 0.8 + i * 0.15)),
      certifications: Math.max(0, Math.round(certifications * progress * 0.75 + i * 0.1)),
    };
  });
}

const legendItems = [
  { key: "skills", label: "Skills", icon: Star, color: "text-emerald-500", bg: "bg-emerald-100" },
  { key: "projects", label: "Projects", icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-100" },
  {
    key: "certifications",
    label: "Certifications",
    icon: Award,
    color: "text-pink-500",
    bg: "bg-pink-100",
  },
] as const;

export function PortfolioOverview({ skills, projects, certifications }: PortfolioOverviewProps) {
  const chartData = buildChartData(skills, projects, certifications);
  const totals = { skills, projects, certifications };

  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Overview</h3>
          <p className={cn("text-sm", adminMutedClass)}>
            Track your portfolio growth and engagement
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium admin-dark:border-white/10 admin-dark:bg-slate-800"
        >
          Last 30 Days
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_180px] gap-6">
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="skillsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projectsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="certsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="skills"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#skillsGradient)"
              />
              <Area
                type="monotone"
                dataKey="projects"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#projectsGradient)"
              />
              <Area
                type="monotone"
                dataKey="certifications"
                stroke="#ec4899"
                strokeWidth={2}
                fill="url(#certsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {legendItems.map((item) => {
            const Icon = item.icon;
            const value = totals[item.key];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 admin-dark:border-white/10 admin-dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("h-8 w-8 rounded-lg flex items-center justify-center", item.bg)}>
                    <Icon className={cn("h-4 w-4", item.color)} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className={cn("text-xs", adminMutedClass)}>↑ 0 from last month</p>
                  </div>
                </div>
                <p className="text-xl font-bold">{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

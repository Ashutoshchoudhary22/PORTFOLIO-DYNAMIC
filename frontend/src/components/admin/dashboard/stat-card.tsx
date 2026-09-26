import type { LucideIcon } from "lucide-react";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type StatColor = "blue" | "purple" | "green" | "orange" | "pink" | "cyan" | "indigo" | "teal";

const colorMap: Record<
  StatColor,
  { icon: string; spark: string; trend: string }
> = {
  blue: {
    icon: "bg-blue-100 text-blue-600",
    spark: "#3b82f6",
    trend: "text-emerald-500",
  },
  purple: {
    icon: "bg-violet-100 text-violet-600",
    spark: "#8b5cf6",
    trend: "text-emerald-500",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600",
    spark: "#10b981",
    trend: "text-emerald-500",
  },
  orange: {
    icon: "bg-orange-100 text-orange-600",
    spark: "#f97316",
    trend: "text-emerald-500",
  },
  pink: {
    icon: "bg-pink-100 text-pink-600",
    spark: "#ec4899",
    trend: "text-emerald-500",
  },
  cyan: {
    icon: "bg-cyan-100 text-cyan-600",
    spark: "#06b6d4",
    trend: "text-emerald-500",
  },
  indigo: {
    icon: "bg-indigo-100 text-indigo-600",
    spark: "#6366f1",
    trend: "text-emerald-500",
  },
  teal: {
    icon: "bg-teal-100 text-teal-600",
    spark: "#14b8a6",
    trend: "text-emerald-500",
  },
};

function Sparkline({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className="absolute bottom-3 right-3 h-10 w-24 opacity-30"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 30 C15 28, 20 18, 35 22 C50 26, 55 10, 70 14 C85 18, 95 8, 120 12 L120 40 L0 40 Z"
        fill={color}
        opacity="0.15"
      />
      <path
        d="M0 30 C15 28, 20 18, 35 22 C50 26, 55 10, 70 14 C85 18, 95 8, 120 12"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
}

type DashboardStatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: StatColor;
};

export function DashboardStatCard({ label, value, icon: Icon, color }: DashboardStatCardProps) {
  const styles = colorMap[color];

  return (
    <div
      className={cn(
        adminCardClass,
        "relative overflow-hidden rounded-2xl p-4 sm:p-5 min-h-[130px]"
      )}
    >
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
            styles.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 relative z-10">
        <p className={cn("text-xs sm:text-sm", adminMutedClass)}>{label}</p>
        <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
        <p className={cn("text-xs mt-2", styles.trend)}>↑ 0 from last month</p>
      </div>
      <Sparkline color={styles.spark} />
    </div>
  );
}

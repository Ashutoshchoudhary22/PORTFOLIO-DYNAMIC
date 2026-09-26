import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<string, string> = {
  "state management": "bg-violet-100 text-violet-700 admin-dark:bg-violet-900/30 admin-dark:text-violet-300",
  frontend: "bg-blue-100 text-blue-700 admin-dark:bg-blue-900/30 admin-dark:text-blue-300",
  backend: "bg-emerald-100 text-emerald-700 admin-dark:bg-emerald-900/30 admin-dark:text-emerald-300",
  languages: "bg-amber-100 text-amber-700 admin-dark:bg-amber-900/30 admin-dark:text-amber-300",
  "devops & cloud": "bg-pink-100 text-pink-700 admin-dark:bg-pink-900/30 admin-dark:text-pink-300",
  database: "bg-cyan-100 text-cyan-700 admin-dark:bg-cyan-900/30 admin-dark:text-cyan-300",
  tools: "bg-slate-100 text-slate-700 admin-dark:bg-slate-800 admin-dark:text-slate-300",
};

function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category.toLowerCase()] || "bg-indigo-100 text-indigo-700 admin-dark:bg-indigo-900/30 admin-dark:text-indigo-300";
}

export function SkillCategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        getCategoryStyle(category)
      )}
    >
      {category}
    </span>
  );
}

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Languages",
  "State Management",
  "DevOps & Cloud",
  "Database",
  "Tools",
  "Other",
];

"use client";

import { useMemo, useState } from "react";
import { GripVertical, Hexagon, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillCategoryBadge } from "@/components/admin/skills/skill-category-badge";
import type { SkillItem } from "@/lib/types";
import { adminCardClass, adminMutedClass, adminSurfaceClass } from "@/lib/admin-styles";
import { Spinner } from "@/components/loading";
import { cn } from "@/lib/utils";

type SkillsListCardProps = {
  items: SkillItem[];
  loading: boolean;
  onEdit: (item: SkillItem) => void;
  onDelete: (id: string) => void;
};

export function SkillsListCard({ items, loading, onEdit, onDelete }: SkillsListCardProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return unique.sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  return (
    <div className={cn(adminCardClass, "@container min-w-0 rounded-2xl p-4 sm:p-6")}>
      <div className="mb-6 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 admin-dark:bg-indigo-900/30 admin-dark:text-indigo-400">
          <Hexagon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Skills List</h2>
          <p className={cn("text-sm", adminMutedClass)}>Manage your existing skills.</p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 @md:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 admin-dark:border-white/10 admin-dark:bg-slate-800"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 admin-dark:border-white/10 @md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : filteredItems.length === 0 ? (
        <p className={cn("text-center py-12 text-sm", adminMutedClass)}>
          {items.length === 0 ? "No skills yet." : "No skills match your search."}
        </p>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 admin-dark:border-white/10 admin-dark:bg-slate-800/40 @lg:flex-row @lg:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-slate-300 admin-dark:text-white/20 @lg:block" />

                {item.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.iconUrl}
                    alt={item.name}
                    className={`h-10 w-10 shrink-0 rounded-xl object-contain p-1 ${adminSurfaceClass}`}
                    style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}
                  />
                ) : (
                  <div
                    className={`h-10 w-10 shrink-0 rounded-xl ${adminSurfaceClass}`}
                    style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}
                  />
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <div className="mt-1 @lg:hidden">
                    <SkillCategoryBadge category={item.category} />
                  </div>
                </div>
              </div>

              <div className="hidden shrink-0 @lg:block">
                <SkillCategoryBadge category={item.category} />
              </div>

              <div className="grid grid-cols-2 gap-2 @lg:flex @lg:shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 admin-dark:border-blue-900/50 admin-dark:text-blue-400 @lg:w-auto"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="sr-only @sm:not-sr-only">Edit</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-full rounded-lg border-red-200 text-red-500 hover:bg-red-50 admin-dark:border-red-900/50 admin-dark:text-red-400 @lg:w-auto"
                  onClick={() => item._id && onDelete(item._id)}
                >
                  <Trash2 className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="sr-only @sm:not-sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-start gap-3 mb-6">
        <span className="h-11 w-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 admin-dark:bg-indigo-900/30 admin-dark:text-indigo-400">
          <Hexagon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Skills List</h2>
          <p className={cn("text-sm", adminMutedClass)}>Manage your existing skills.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 admin-dark:bg-slate-800 admin-dark:border-white/10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl border-slate-200 admin-dark:border-white/10">
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
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 admin-dark:border-white/10 admin-dark:bg-slate-800/40"
            >
              <GripVertical className="h-4 w-4 text-slate-300 shrink-0 cursor-grab admin-dark:text-white/20" />

              {item.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.iconUrl}
                  alt={item.name}
                  className={`h-10 w-10 rounded-xl object-contain shrink-0 p-1 ${adminSurfaceClass}`}
                  style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}
                />
              ) : (
                <div
                  className={`h-10 w-10 rounded-xl shrink-0 ${adminSurfaceClass}`}
                  style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
              </div>

              <SkillCategoryBadge category={item.category} />

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 admin-dark:border-blue-900/50 admin-dark:text-blue-400"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-lg border-red-200 text-red-500 hover:bg-red-50 admin-dark:border-red-900/50 admin-dark:text-red-400"
                  onClick={() => item._id && onDelete(item._id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

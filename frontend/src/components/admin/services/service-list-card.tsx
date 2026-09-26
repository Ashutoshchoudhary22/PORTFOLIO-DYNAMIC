"use client";

import { useMemo, useState } from "react";
import {
  Cloud,
  Cpu,
  Database,
  GripVertical,
  LayoutGrid,
  Pencil,
  Search,
  Smartphone,
  Trash2,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ServiceItem } from "@/lib/types";
import { adminCardClass, adminMutedClass, adminSurfaceClass } from "@/lib/admin-styles";
import { Spinner } from "@/components/loading";
import { cn } from "@/lib/utils";

const ICON_STYLES = [
  { bg: "bg-blue-100 text-blue-600 admin-dark:bg-blue-900/30 admin-dark:text-blue-300", icon: Cloud },
  { bg: "bg-violet-100 text-violet-600 admin-dark:bg-violet-900/30 admin-dark:text-violet-300", icon: Smartphone },
  { bg: "bg-emerald-100 text-emerald-600 admin-dark:bg-emerald-900/30 admin-dark:text-emerald-300", icon: Cpu },
  { bg: "bg-cyan-100 text-cyan-600 admin-dark:bg-cyan-900/30 admin-dark:text-cyan-300", icon: Cloud },
  { bg: "bg-pink-100 text-pink-600 admin-dark:bg-pink-900/30 admin-dark:text-pink-300", icon: Database },
];

function getServiceIcon(item: ServiceItem, index: number) {
  const map: Record<string, typeof Cloud> = {
    cloud: Cloud,
    database: Database,
    code: Cpu,
    custom: Wrench,
  };
  const Icon = map[item.iconType || ""] || ICON_STYLES[index % ICON_STYLES.length].icon;
  const style = ICON_STYLES[index % ICON_STYLES.length];
  return { Icon, style };
}

type ServiceListCardProps = {
  items: ServiceItem[];
  loading: boolean;
  onEdit: (item: ServiceItem) => void;
  onDelete: (id: string) => void;
};

export function ServiceListCard({ items, loading, onEdit, onDelete }: ServiceListCardProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return unique.sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.code || "").toLowerCase().includes(query) ||
        (item.category || "").toLowerCase().includes(query);

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-start gap-3">
          <span className="h-11 w-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 admin-dark:bg-indigo-900/30 admin-dark:text-indigo-400">
            <LayoutGrid className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Services</h2>
            <p className={cn("text-sm", adminMutedClass)}>Manage your added services.</p>
          </div>
        </div>
        <p className="hidden lg:block text-xs italic text-slate-400 admin-dark:text-white/40 max-w-[120px] text-right">
          Manage your services easily ⚙️
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 admin-dark:bg-slate-800 admin-dark:border-white/10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[160px] h-11 rounded-xl border-slate-200 admin-dark:border-white/10">
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
          {items.length === 0 ? "No services yet." : "No services match your search."}
        </p>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item, index) => {
            const { Icon, style } = getServiceIcon(item, index);
            const meta = [item.code, item.category].filter(Boolean).join(" • ");

            return (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 admin-dark:border-white/10 admin-dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <GripVertical className="h-4 w-4 text-slate-300 shrink-0 cursor-grab admin-dark:text-white/20 hidden sm:block" />

                  {item.image?.secureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image.secureUrl}
                      alt={item.title}
                      className={`h-11 w-11 rounded-xl object-cover shrink-0 p-0.5 ${adminSurfaceClass}`}
                    />
                  ) : (
                    <span
                      className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                        style.bg
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{item.title}</p>
                    {meta && <p className={cn("text-xs truncate", adminMutedClass)}>{meta}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
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
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Award, Calendar, GripVertical, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CertificationItem } from "@/lib/types";
import { adminCardClass, adminMutedClass, adminSurfaceClass } from "@/lib/admin-styles";
import { Spinner } from "@/components/loading";
import { cn } from "@/lib/utils";

const ICON_STYLES = [
  "bg-orange-100 text-orange-600 admin-dark:bg-orange-900/30 admin-dark:text-orange-300",
  "bg-blue-100 text-blue-600 admin-dark:bg-blue-900/30 admin-dark:text-blue-300",
  "bg-yellow-100 text-yellow-700 admin-dark:bg-yellow-900/30 admin-dark:text-yellow-300",
  "bg-violet-100 text-violet-600 admin-dark:bg-violet-900/30 admin-dark:text-violet-300",
];

type CertificationListCardProps = {
  items: CertificationItem[];
  loading: boolean;
  onEdit: (item: CertificationItem) => void;
  onDelete: (id: string) => void;
};

export function CertificationListCard({
  items,
  loading,
  onEdit,
  onDelete,
}: CertificationListCardProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(query) ||
        item.issuer.toLowerCase().includes(query) ||
        (item.period || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.isActive) ||
        (statusFilter === "inactive" && !item.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-start gap-3 mb-6">
        <span className="h-11 w-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 admin-dark:bg-indigo-900/30 admin-dark:text-indigo-400">
          <Award className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Certification List</h2>
          <p className={cn("text-sm", adminMutedClass)}>Manage your existing certifications.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search certifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-slate-50 border-slate-200 admin-dark:bg-slate-800 admin-dark:border-white/10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px] h-11 rounded-xl border-slate-200 admin-dark:border-white/10">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : filteredItems.length === 0 ? (
        <p className={cn("text-center py-12 text-sm", adminMutedClass)}>
          {items.length === 0 ? "No certifications yet." : "No certifications match your search."}
        </p>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item, index) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 admin-dark:border-white/10 admin-dark:bg-slate-800/40"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <GripVertical className="h-4 w-4 text-slate-300 shrink-0 cursor-grab admin-dark:text-white/20 hidden sm:block" />

                {item.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.iconUrl}
                    alt={item.title}
                    className={`h-11 w-11 rounded-xl object-contain shrink-0 p-1 ${adminSurfaceClass}`}
                  />
                ) : (
                  <span
                    className={cn(
                      "h-11 w-11 rounded-xl flex items-center justify-center shrink-0",
                      ICON_STYLES[index % ICON_STYLES.length]
                    )}
                  >
                    <Award className="h-5 w-5" />
                  </span>
                )}

                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{item.title}</p>
                  <p className={cn("text-sm truncate", adminMutedClass)}>{item.issuer}</p>
                  {item.period && (
                    <p className="text-xs text-slate-400 admin-dark:text-white/40 flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.period}</span>
                    </p>
                  )}
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
          ))}
        </div>
      )}
    </div>
  );
}

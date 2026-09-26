"use client";

import { useMemo, useState } from "react";
import { Calendar, FolderKanban, GripVertical, LayoutGrid, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectItem } from "@/lib/types";
import { adminCardClass, adminMutedClass, adminSurfaceClass } from "@/lib/admin-styles";
import { Spinner } from "@/components/loading";
import { cn } from "@/lib/utils";

type ProjectListCardProps = {
  items: ProjectItem[];
  loading: boolean;
  onEdit: (item: ProjectItem) => void;
  onDelete: (id: string) => void;
};

function getProjectPreview(item: ProjectItem) {
  return (
    item.thumbnail?.secureUrl ||
    item.media?.find((media) => media.type === "image")?.secureUrl
  );
}

function getShortText(item: ProjectItem) {
  if (item.shortDescription?.trim()) return item.shortDescription;
  if (!item.description) return "Short Description";
  return item.description.length > 80 ? `${item.description.slice(0, 80)}...` : item.description;
}

export function ProjectListCard({ items, loading, onEdit, onDelete }: ProjectListCardProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.tags || []).some((tag) => tag.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && item.published) ||
        (statusFilter === "draft" && !item.published) ||
        (statusFilter === "featured" && item.featured);

      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-start gap-3 mb-6">
        <span className="h-11 w-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 admin-dark:bg-indigo-900/30 admin-dark:text-indigo-400">
          <LayoutGrid className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className={cn("text-sm", adminMutedClass)}>Manage your portfolio projects.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search projects..."
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
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : filteredItems.length === 0 ? (
        <p className={cn("text-center py-12 text-sm", adminMutedClass)}>
          {items.length === 0 ? "No projects yet." : "No projects match your search."}
        </p>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const preview = getProjectPreview(item);

            return (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 admin-dark:border-white/10 admin-dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <GripVertical className="h-4 w-4 text-slate-300 shrink-0 cursor-grab admin-dark:text-white/20 hidden sm:block" />

                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt={item.title}
                      className="h-14 w-20 rounded-lg object-cover shrink-0 border border-slate-200 admin-dark:border-white/10"
                    />
                  ) : (
                    <span
                      className={`h-14 w-20 rounded-lg shrink-0 flex items-center justify-center ${adminSurfaceClass}`}
                    >
                      <FolderKanban className="h-5 w-5 text-slate-400" />
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{item.title}</p>
                    <p className="text-xs text-emerald-600 admin-dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {item.published ? "Published" : "Draft"}
                      {item.featured ? " • Featured" : ""}
                    </p>
                    <p className={cn("text-xs mt-1 line-clamp-2", adminMutedClass)}>
                      {getShortText(item)}
                    </p>
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

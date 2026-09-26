"use client";

import { useEffect, useState } from "react";
import { FolderKanban } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectFormCard } from "@/components/admin/projects/project-form-card";
import { ProjectListCard } from "@/components/admin/projects/project-list-card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { sanitizeMediaArray, sanitizeMediaItem } from "@/lib/media-utils";
import { adminMutedClass } from "@/lib/admin-styles";
import type { MediaItem, ProjectItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

const emptyForm: Partial<ProjectItem> = {
  title: "",
  slug: "",
  description: "",
  tags: [],
  liveUrl: "",
  githubUrl: "",
  featured: false,
  published: true,
  sortOrder: 0,
  media: [],
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<ProjectItem>>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadItems() {
    const token = getAdminToken();
    if (!token) return;
    setItems(await adminApi.getProjects(token));
  }

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setEditingId(null);
    setTagsInput("");
    setForm(emptyForm);
    setMessage(null);
  }

  function addMedia(media: MediaItem | null) {
    if (!media) return;
    const clean = sanitizeMediaItem(media);
    if (!clean) return;

    setForm((prev) => ({
      ...prev,
      media: [...sanitizeMediaArray(prev.media || []), clean],
    }));
  }

  function removeMedia(index: number) {
    setForm((prev) => ({
      ...prev,
      media: (prev.media || []).filter((_, i) => i !== index),
    }));
  }

  function startEdit(item: ProjectItem) {
    setEditingId(item._id || null);
    setForm({
      ...item,
      media: sanitizeMediaArray(item.media || []),
      thumbnail: sanitizeMediaItem(item.thumbnail) || undefined,
    });
    setTagsInput((item.tags || []).join(", "));
    setMessage(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      liveUrl: form.liveUrl,
      githubUrl: form.githubUrl,
      featured: form.featured,
      published: form.published,
      sortOrder: form.sortOrder ?? 0,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      media: sanitizeMediaArray(form.media || []),
      thumbnail: sanitizeMediaItem(form.thumbnail) || null,
    };

    try {
      if (editingId) {
        await adminApi.updateProject(token, editingId, payload);
        setMessage("Project updated successfully.");
      } else {
        await adminApi.createProject(token, payload);
        setMessage("Project created successfully.");
        resetForm();
      }

      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm("Delete project?")) return;
    await adminApi.deleteProject(token, id);
    await loadItems();
    if (editingId === id) resetForm();
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="h-12 w-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 admin-dark:bg-violet-900/30 admin-dark:text-violet-400">
              <FolderKanban className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
              <p className={`mt-1 text-sm sm:text-base max-w-2xl ${adminMutedClass}`}>
                Showcase your amazing projects and manage your portfolio showcase.
              </p>
            </div>
          </div>

          <p className="hidden xl:block text-sm italic text-slate-400 admin-dark:text-white/40 max-w-[200px] text-right leading-relaxed">
            Build something great today. 🌱
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
          <ProjectFormCard
            form={form}
            tagsInput={tagsInput}
            editingId={editingId}
            saving={saving}
            message={message}
            onChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
            onTagsChange={setTagsInput}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onThumbnailChange={(media) =>
              setForm((prev) => ({ ...prev, thumbnail: media || undefined }))
            }
            onAddMedia={addMedia}
            onRemoveMedia={removeMedia}
            onClearMedia={() => setForm((prev) => ({ ...prev, media: [] }))}
          />

          <ProjectListCard
            items={items}
            loading={false}
            onEdit={startEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AdminShell>
  );
}

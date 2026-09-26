"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaUploader } from "@/components/admin/media-uploader";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { downloadMedia, sanitizeMediaArray, sanitizeMediaItem } from "@/lib/media-utils";
import type { MediaItem, ProjectItem } from "@/lib/types";
import { Spinner } from "@/components/loading";
import { adminBorderClass, adminCardClass, adminFaintClass, adminMutedClass } from "@/lib/admin-styles";

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

function MediaPreview({ media }: { media: MediaItem }) {
  return (
    <div className={`rounded border p-2 space-y-2 ${adminBorderClass}`}>
      {media.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.secureUrl} alt={media.originalFilename || media.publicId} className="h-24 w-full object-cover rounded" />
      ) : (
        <video src={media.secureUrl} controls className="h-24 w-full object-cover rounded" />
      )}
      <p className="text-xs truncate">{media.originalFilename || media.publicId}</p>
    </div>
  );
}

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
      }

      await loadItems();
      resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Project" : "Add Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Title"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Input
                placeholder="Slug (optional)"
                value={form.slug || ""}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <Input
                placeholder="Tags (comma separated)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
              <Input
                placeholder="Live URL"
                value={form.liveUrl || ""}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
              />
              <Input
                placeholder="GitHub URL"
                value={form.githubUrl || ""}
                onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Sort Order"
                value={form.sortOrder ?? 0}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form.published)}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Published
              </label>

              <MediaUploader
                label="Main Thumbnail (shown first on portfolio)"
                resourceType="image"
                folder="portfolio/projects"
                value={form.thumbnail || null}
                disabled={saving}
                onChange={(media) => setForm({ ...form, thumbnail: media || undefined })}
              />

              <MediaUploader
                label="Add Project Image"
                resourceType="image"
                folder="portfolio/projects"
                value={null}
                disabled={saving}
                onChange={addMedia}
              />

              <MediaUploader
                label="Add Project Video"
                accept="video/*"
                resourceType="video"
                folder="portfolio/projects"
                value={null}
                disabled={saving}
                onChange={addMedia}
              />

              {(form.media || []).length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Project Media Gallery</p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setForm({ ...form, media: [] })}
                    >
                      Clear All Media
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(form.media || []).map((media, index) => (
                      <div key={`${media.publicId}-${index}`} className="space-y-2">
                        <MediaPreview media={media} />
                        <div className="flex gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => downloadMedia(media)}>
                            Download
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => removeMedia(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message && (
                <p className={`text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Project" : "Create Project"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Spinner />
            ) : (
              items.map((item) => {
                const preview =
                  item.thumbnail?.secureUrl ||
                  item.media?.find((media) => media.type === "image")?.secureUrl;

                return (
                  <div key={item._id} className={`border rounded-md p-3 space-y-3 ${adminBorderClass}`}>
                    <div className="flex gap-3">
                      {preview && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt={item.title} className="h-16 w-24 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className={`text-xs ${adminMutedClass}`}>
                          {item.published ? "Published" : "Draft"} • {item.featured ? "Featured" : "Standard"}
                        </p>
                        <p className={`text-xs mt-1 ${adminFaintClass}`}>
                          {(item.media || []).length} media • {item.thumbnail ? "has thumbnail" : "no thumbnail"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          const token = getAdminToken();
                          if (!token || !item._id) return;
                          if (!confirm("Delete project?")) return;
                          await adminApi.deleteProject(token, item._id);
                          await loadItems();
                          if (editingId === item._id) resetForm();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

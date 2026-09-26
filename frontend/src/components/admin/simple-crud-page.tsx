"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminToken } from "@/lib/admin-auth";
import { MediaUploader } from "@/components/admin/media-uploader";
import { Spinner } from "@/components/loading";
import { adminBorderClass, adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import type { MediaItem } from "@/lib/types";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "checkbox" | "media";
  placeholder?: string;
  mediaFolder?: string;
};

function urlToMediaItem(url: unknown): MediaItem | null {
  if (typeof url !== "string" || !url.trim()) return null;

  return {
    type: "image",
    provider: "cloudinary",
    publicId: url,
    secureUrl: url,
  };
}

interface SimpleCrudPageProps<T extends { _id?: string }> {
  title: string;
  fields: FieldConfig[];
  emptyItem: Record<string, unknown>;
  listLabel: (item: T) => string;
  fetchItems: (token: string) => Promise<T[]>;
  createItem: (token: string, data: Record<string, unknown>) => Promise<unknown>;
  updateItem: (token: string, id: string, data: Record<string, unknown>) => Promise<unknown>;
  deleteItem: (token: string, id: string) => Promise<unknown>;
}

export function SimpleCrudPage<T extends { _id?: string }>({
  title,
  fields,
  emptyItem,
  listLabel,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
}: SimpleCrudPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [form, setForm] = useState<Record<string, unknown>>(emptyItem);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    const data = await fetchItems(token);
    setItems(data);
  }, [fetchItems]);

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, [loadItems]);

  function resetForm() {
    setForm(emptyItem);
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateItem(token, editingId, form);
      } else {
        await createItem(token, form);
      }
      await loadItems();
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm("Delete this item?")) return;
    await deleteItem(token, id);
    await loadItems();
    if (editingId === id) resetForm();
  }

  return (
    <AdminShell>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className={adminCardClass}>
          <CardHeader>
            <CardTitle>{editingId ? `Edit ${title}` : `Add ${title}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              {fields.map((field) =>
                field.type === "media" ? (
                  <MediaUploader
                    key={field.name}
                    label={field.label}
                    resourceType="image"
                    accept="image/*"
                    folder={field.mediaFolder || "portfolio/skills"}
                    value={urlToMediaItem(form[field.name])}
                    disabled={saving}
                    onChange={(media) =>
                      setForm((prev) => ({ ...prev, [field.name]: media?.secureUrl || "" }))
                    }
                  />
                ) : field.type === "textarea" ? (
                  <Textarea
                    key={field.name}
                    placeholder={field.placeholder || field.label}
                    value={String(form[field.name] ?? "")}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    required={field.name !== "description" && field.name !== "period"}
                  />
                ) : field.type === "checkbox" ? (
                  <label key={field.name} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.name])}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })}
                    />
                    {field.label}
                  </label>
                ) : (
                  <Input
                    key={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder || field.label}
                    value={String(form[field.name] ?? "")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field.name]:
                          field.type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                  />
                )
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
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
            <CardTitle>{title} List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Spinner />
            ) : items.length === 0 ? (
              <p className={adminMutedClass}>No items yet.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border rounded-md p-3 ${adminBorderClass}`}
                >
                  <p className="text-sm">{listLabel(item)}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(item._id || null);
                        setForm(item as unknown as Record<string, unknown>);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => item._id && handleDelete(item._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaUploader } from "@/components/admin/media-uploader";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { MediaItem, SkillItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

const emptyForm: Partial<SkillItem> = {
  name: "",
  description: "",
  category: "",
  iconUrl: "",
  bgColor: "",
  sortOrder: 0,
  isActive: true,
};

function iconUrlToMedia(url?: string): MediaItem | null {
  if (!url?.trim()) return null;

  return {
    type: "image",
    provider: "cloudinary",
    publicId: url,
    secureUrl: url,
  };
}

function buildPayload(form: Partial<SkillItem>) {
  return {
    name: form.name,
    description: form.description,
    category: form.category,
    iconUrl: form.iconUrl || "",
    bgColor: form.bgColor,
    sortOrder: form.sortOrder ?? 0,
    isActive: form.isActive ?? true,
  };
}

export default function AdminSkillsPage() {
  const [items, setItems] = useState<SkillItem[]>([]);
  const [form, setForm] = useState<Partial<SkillItem>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef(form);

  formRef.current = form;

  async function loadItems() {
    const token = getAdminToken();
    if (!token) return;
    setItems(await adminApi.getSkills(token));
  }

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage(null);
  }

  function startEdit(item: SkillItem) {
    setEditingId(item._id || null);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      iconUrl: item.iconUrl || "",
      bgColor: item.bgColor || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setMessage(null);
  }

  async function saveSkill(nextForm: Partial<SkillItem>, successText: string) {
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    try {
      const payload = buildPayload(nextForm);

      if (editingId) {
        await adminApi.updateSkill(token, editingId, payload);
      } else {
        await adminApi.createSkill(token, payload);
        resetForm();
      }

      await loadItems();
      setMessage(successText);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save skill.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await saveSkill(
      form,
      editingId ? "Skill updated successfully." : "Skill created successfully."
    );
  }

  async function handleIconChange(media: MediaItem | null) {
    const nextForm = { ...formRef.current, iconUrl: media?.secureUrl || "" };
    setForm(nextForm);

    if (editingId) {
      await saveSkill(nextForm, "Skill icon saved successfully.");
    }
  }

  return (
    <AdminShell>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Skill" : "Add Skill"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Name"
                value={form.name || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                placeholder="Category"
                value={form.category || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                required
              />
              <Textarea
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
              <MediaUploader
                label="Skill Icon"
                resourceType="image"
                accept="image/*"
                folder="portfolio/skills"
                value={iconUrlToMedia(form.iconUrl)}
                disabled={saving}
                onChange={handleIconChange}
              />
              {!editingId && form.iconUrl && (
                <p className="text-xs text-white/60">
                  Icon uploaded. Click Create to save this skill.
                </p>
              )}
              <Input
                placeholder="Background Color"
                value={form.bgColor || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, bgColor: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Sort Order"
                value={form.sortOrder ?? 0}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))
                }
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(form.isActive)}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                Active
              </label>

              {message && (
                <p
                  className={`text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}
                >
                  {message}
                </p>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Skill" : "Create Skill"}
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

        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Spinner />
            ) : items.length === 0 ? (
              <p className="text-white/60">No skills yet.</p>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 border border-white/10 rounded-md p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.iconUrl}
                        alt={item.name}
                        className="h-10 w-10 rounded object-contain bg-white/5 shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-white/5 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-white/60 truncate">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        const token = getAdminToken();
                        if (!token || !item._id) return;
                        if (!confirm("Delete this skill?")) return;
                        await adminApi.deleteSkill(token, item._id);
                        await loadItems();
                        if (editingId === item._id) resetForm();
                      }}
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

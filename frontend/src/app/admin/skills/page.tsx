"use client";

import { useEffect, useRef, useState } from "react";
import { Code2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SkillFormCard } from "@/components/admin/skills/skill-form-card";
import { SkillsListCard } from "@/components/admin/skills/skills-list-card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { MediaItem, SkillItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

const emptyForm: Partial<SkillItem> = {
  name: "",
  description: "",
  category: "",
  iconUrl: "",
  bgColor: "#6366F1",
  sortOrder: 0,
  isActive: true,
};

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
      bgColor: item.bgColor || "#6366F1",
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

  async function handleDelete(id: string) {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm("Delete this skill?")) return;
    await adminApi.deleteSkill(token, id);
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
        <AdminPageHeader
          title="Skills & Technologies"
          description="Add your technical skills and tools to showcase your expertise."
          icon={Code2}
          iconClassName="bg-violet-100 text-violet-600 admin-dark:bg-violet-900/30 admin-dark:text-violet-400"
          quote="Build the skills you need for your next big thing."
          quoteEmoji="💻"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
          <SkillFormCard
            form={form}
            editingId={editingId}
            saving={saving}
            message={message}
            onChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onIconChange={handleIconChange}
          />

          <SkillsListCard
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

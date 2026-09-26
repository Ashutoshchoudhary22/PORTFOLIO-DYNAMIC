"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ExperienceFormCard } from "@/components/admin/experience/experience-form-card";
import { ExperienceListCard } from "@/components/admin/experience/experience-list-card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { adminMutedClass } from "@/lib/admin-styles";
import type { ExperienceItem, MediaItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

const emptyForm: Partial<ExperienceItem> = {
  role: "",
  company: "",
  period: "",
  description: "",
  iconUrl: "",
  sortOrder: 0,
  isActive: true,
};

function buildPayload(form: Partial<ExperienceItem>) {
  return {
    role: form.role,
    company: form.company,
    period: form.period,
    description: form.description,
    iconUrl: form.iconUrl || "",
    sortOrder: form.sortOrder ?? 0,
    isActive: form.isActive ?? true,
  };
}

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [form, setForm] = useState<Partial<ExperienceItem>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef(form);

  formRef.current = form;

  async function loadItems() {
    const token = getAdminToken();
    if (!token) return;
    setItems(await adminApi.getExperience(token));
  }

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage(null);
  }

  function startEdit(item: ExperienceItem) {
    setEditingId(item._id || null);
    setForm({
      role: item.role,
      company: item.company,
      period: item.period || "",
      description: item.description,
      iconUrl: item.iconUrl || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setMessage(null);
  }

  async function saveExperience(nextForm: Partial<ExperienceItem>, successText: string) {
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    try {
      const payload = buildPayload(nextForm);

      if (editingId) {
        await adminApi.updateExperience(token, editingId, payload);
      } else {
        await adminApi.createExperience(token, payload);
        resetForm();
      }

      await loadItems();
      setMessage(successText);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save experience.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await saveExperience(
      form,
      editingId ? "Experience updated successfully." : "Experience created successfully."
    );
  }

  async function handleIconChange(media: MediaItem | null) {
    const nextForm = { ...formRef.current, iconUrl: media?.secureUrl || "" };
    setForm(nextForm);

    if (editingId) {
      await saveExperience(nextForm, "Company logo saved successfully.");
    }
  }

  async function handleDelete(id: string) {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm("Delete this experience entry?")) return;
    await adminApi.deleteExperience(token, id);
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
          title="Add Experience"
          description="Showcase your professional journey and work experience."
          icon={Briefcase}
          iconClassName="bg-violet-100 text-violet-600 admin-dark:bg-violet-900/30 admin-dark:text-violet-400"
          quote="Your experience builds your story."
          quoteEmoji="🌱"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
          <ExperienceFormCard
            form={form}
            editingId={editingId}
            saving={saving}
            message={message}
            onChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onIconChange={handleIconChange}
          />

          <ExperienceListCard
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

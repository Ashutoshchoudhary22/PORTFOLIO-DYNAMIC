"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EducationFormCard } from "@/components/admin/education/education-form-card";
import { EducationListCard } from "@/components/admin/education/education-list-card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { EducationItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

const emptyForm: Partial<EducationItem> = {
  degree: "",
  institution: "",
  period: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

function buildPayload(form: Partial<EducationItem>) {
  return {
    degree: form.degree,
    institution: form.institution,
    period: form.period,
    description: form.description,
    sortOrder: form.sortOrder ?? 0,
    isActive: form.isActive ?? true,
  };
}

export default function AdminEducationPage() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [form, setForm] = useState<Partial<EducationItem>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadItems() {
    const token = getAdminToken();
    if (!token) return;
    setItems(await adminApi.getEducation(token));
  }

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage(null);
  }

  function startEdit(item: EducationItem) {
    setEditingId(item._id || null);
    setForm({
      degree: item.degree,
      institution: item.institution,
      period: item.period || "",
      description: item.description || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setMessage(null);
  }

  async function saveEducation(nextForm: Partial<EducationItem>, successText: string) {
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    try {
      const payload = buildPayload(nextForm);

      if (editingId) {
        await adminApi.updateEducation(token, editingId, payload);
      } else {
        await adminApi.createEducation(token, payload);
        resetForm();
      }

      await loadItems();
      setMessage(successText);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save education.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await saveEducation(
      form,
      editingId ? "Education updated successfully." : "Education created successfully."
    );
  }

  async function handleDelete(id: string) {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm("Delete this education entry?")) return;
    await adminApi.deleteEducation(token, id);
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
          title="Education"
          description="Add and manage your educational background and qualifications."
          icon={GraduationCap}
          iconClassName="bg-violet-100 text-violet-600 admin-dark:bg-violet-900/30 admin-dark:text-violet-400"
          quote="Never stop learning."
          quoteEmoji="✨"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
          <EducationFormCard
            form={form}
            editingId={editingId}
            saving={saving}
            message={message}
            onChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <EducationListCard
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

"use client";

import { useEffect, useRef, useState } from "react";
import { Award } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { CertificationFormCard } from "@/components/admin/certifications/certification-form-card";
import { CertificationListCard } from "@/components/admin/certifications/certification-list-card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { adminMutedClass } from "@/lib/admin-styles";
import type { CertificationItem, MediaItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

const emptyForm: Partial<CertificationItem> = {
  title: "",
  issuer: "",
  period: "",
  description: "",
  iconUrl: "",
  sortOrder: 0,
  isActive: true,
};

function buildPayload(form: Partial<CertificationItem>) {
  return {
    title: form.title,
    issuer: form.issuer,
    period: form.period,
    description: form.description,
    iconUrl: form.iconUrl || "",
    sortOrder: form.sortOrder ?? 0,
    isActive: form.isActive ?? true,
  };
}

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<CertificationItem[]>([]);
  const [form, setForm] = useState<Partial<CertificationItem>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef(form);

  formRef.current = form;

  async function loadItems() {
    const token = getAdminToken();
    if (!token) return;
    setItems(await adminApi.getCertifications(token));
  }

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage(null);
  }

  function startEdit(item: CertificationItem) {
    setEditingId(item._id || null);
    setForm({
      title: item.title,
      issuer: item.issuer,
      period: item.period || "",
      description: item.description || "",
      iconUrl: item.iconUrl || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setMessage(null);
  }

  async function saveCertification(nextForm: Partial<CertificationItem>, successText: string) {
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    try {
      const payload = buildPayload(nextForm);

      if (editingId) {
        await adminApi.updateCertification(token, editingId, payload);
      } else {
        await adminApi.createCertification(token, payload);
        resetForm();
      }

      await loadItems();
      setMessage(successText);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save certification.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await saveCertification(
      form,
      editingId ? "Certification updated successfully." : "Certification created successfully."
    );
  }

  async function handleIconChange(media: MediaItem | null) {
    const nextForm = { ...formRef.current, iconUrl: media?.secureUrl || "" };
    setForm(nextForm);

    if (editingId) {
      await saveCertification(nextForm, "Certification logo saved successfully.");
    }
  }

  async function handleDelete(id: string) {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm("Delete this certification?")) return;
    await adminApi.deleteCertification(token, id);
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
              <Award className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Certifications</h1>
              <p className={`mt-1 text-sm sm:text-base max-w-2xl ${adminMutedClass}`}>
                Add and manage your professional certifications and achievements.
              </p>
            </div>
          </div>

          <p className="hidden xl:block text-sm italic text-slate-400 admin-dark:text-white/40 max-w-[200px] text-right leading-relaxed">
            Your skills build your future 🏆
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
          <CertificationFormCard
            form={form}
            editingId={editingId}
            saving={saving}
            message={message}
            onChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            onIconChange={handleIconChange}
          />

          <CertificationListCard
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

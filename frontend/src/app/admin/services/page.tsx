"use client";

import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceFormCard } from "@/components/admin/services/service-form-card";
import { ServiceListCard } from "@/components/admin/services/service-list-card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { adminMutedClass } from "@/lib/admin-styles";
import type { ServiceItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

const emptyForm: Partial<ServiceItem> = {
  title: "",
  description: "",
  code: "",
  category: "",
  iconType: "code",
  sortOrder: 0,
  isActive: true,
};

const CATEGORY_BY_ICON: Record<string, string> = {
  code: "Web Development",
  database: "Database",
  cloud: "Cloud Services",
  custom: "Mobile Development",
};

function buildPayload(form: Partial<ServiceItem>) {
  const iconType = form.iconType || "code";
  return {
    title: form.title,
    description: form.description,
    code: form.code || "",
    category: form.category || CATEGORY_BY_ICON[iconType] || "",
    iconType,
    image: form.image || null,
    video: form.video || null,
    sortOrder: form.sortOrder ?? 0,
    isActive: form.isActive ?? true,
  };
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState<Partial<ServiceItem>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadItems() {
    const token = getAdminToken();
    if (!token) return;
    setItems(await adminApi.getServices(token));
  }

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage(null);
  }

  function startEdit(item: ServiceItem) {
    setEditingId(item._id || null);
    setForm({
      title: item.title,
      description: item.description,
      code: item.code || "",
      category: item.category || "",
      iconType: item.iconType || "code",
      image: item.image,
      video: item.video,
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setMessage(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    try {
      const payload = buildPayload(form);

      if (editingId) {
        await adminApi.updateService(token, editingId, payload);
        setMessage("Service updated successfully.");
      } else {
        await adminApi.createService(token, payload);
        setMessage("Service created successfully.");
        resetForm();
      }

      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save service.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const token = getAdminToken();
    if (!token) return;
    if (!confirm("Delete this service?")) return;
    await adminApi.deleteService(token, id);
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
          title="Services"
          description="Add and manage services to showcase your technical expertise."
          icon={Wrench}
          iconClassName="bg-violet-100 text-violet-600 admin-dark:bg-violet-900/30 admin-dark:text-violet-400"
          quote="Deliver value through your skills."
          quoteEmoji="🛠️"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-6">
          <ServiceFormCard
            form={form}
            editingId={editingId}
            saving={saving}
            message={message}
            onChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <ServiceListCard
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

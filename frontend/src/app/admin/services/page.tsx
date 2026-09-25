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
import type { MediaItem, ServiceItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<ServiceItem>>({
    title: "",
    description: "",
    iconType: "code",
    sortOrder: 0,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadItems() {
    const token = getAdminToken();
    if (!token) return;
    setItems(await adminApi.getServices(token));
  }

  useEffect(() => {
    loadItems().finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return;

    if (editingId) {
      await adminApi.updateService(token, editingId, form);
    } else {
      await adminApi.createService(token, form);
    }

    await loadItems();
    setEditingId(null);
    setForm({ title: "", description: "", iconType: "code", sortOrder: 0, isActive: true });
  }

  return (
    <AdminShell>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Service" : "Add Service"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Title"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <Input
                placeholder="Icon Type (code/database/cloud)"
                value={form.iconType || "code"}
                onChange={(e) => setForm({ ...form, iconType: e.target.value })}
              />
              <MediaUploader
                label="Service Image"
                resourceType="image"
                folder="portfolio/services"
                value={form.image || null}
                onChange={(media) => setForm({ ...form, image: media as MediaItem })}
              />
              <MediaUploader
                label="Service Video"
                accept="video/*"
                resourceType="video"
                folder="portfolio/services"
                value={form.video || null}
                onChange={(media) => setForm({ ...form, video: media as MediaItem })}
              />
              <Button type="submit">{editingId ? "Update" : "Create"}</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <Spinner />
            ) : (
              items.map((item) => (
                <div key={item._id} className="border border-white/10 rounded-md p-3 flex justify-between gap-3">
                  <p>{item.title}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(item._id || null);
                        setForm(item);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        const token = getAdminToken();
                        if (!token || !item._id) return;
                        await adminApi.deleteService(token, item._id);
                        await loadItems();
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

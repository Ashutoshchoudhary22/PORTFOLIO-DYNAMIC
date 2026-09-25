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
import type { MediaItem } from "@/lib/types";
import { Spinner } from "@/components/loading";

type SiteSettingsForm = {
  profileName?: string;
  heroHeading?: string;
  heroSubtitle?: string;
  aboutText?: string;
  contactEmail?: string;
  logo?: MediaItem;
  resume?: MediaItem;
  seo?: {
    title?: string;
    description?: string;
  };
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsForm>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;
    adminApi
      .getSettings(token)
      .then((data) => setSettings(data as SiteSettingsForm))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const token = getAdminToken();
    if (!token) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateSettings(token, settings);
      setSettings(updated);
    } finally {
      setSaving(false);
    }
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
      <Card className="bg-slate-900 border-white/10 max-w-3xl">
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Profile Name"
              value={settings.profileName || ""}
              onChange={(e) => setSettings({ ...settings, profileName: e.target.value })}
            />
            <Input
              placeholder="Hero Heading"
              value={settings.heroHeading || ""}
              onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
            />
            <Textarea
              placeholder="Hero Subtitle"
              value={settings.heroSubtitle || ""}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
            />
            <Textarea
              placeholder="About Text"
              value={settings.aboutText || ""}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
            />
            <Input
              placeholder="Contact Email"
              value={settings.contactEmail || ""}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
            <Input
              placeholder="SEO Title"
              value={settings.seo?.title || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...settings.seo, title: e.target.value },
                })
              }
            />
            <Textarea
              placeholder="SEO Description"
              value={settings.seo?.description || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...settings.seo, description: e.target.value },
                })
              }
            />
            <MediaUploader
              label="Logo"
              resourceType="image"
              folder="portfolio/branding"
              value={settings.logo || null}
              onChange={(media) => setSettings({ ...settings, logo: media as MediaItem })}
            />
            <MediaUploader
              label="Resume (PDF or image)"
              accept="application/pdf,image/*"
              resourceType="auto"
              folder="portfolio/resume"
              value={settings.resume || null}
              onChange={(media) => setSettings({ ...settings, resume: media as MediaItem })}
            />
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

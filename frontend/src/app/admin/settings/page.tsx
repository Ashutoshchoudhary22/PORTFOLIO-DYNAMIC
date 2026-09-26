"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  FolderKanban,
  Mail,
  Save,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  SettingsInputField,
  SettingsTextareaField,
} from "@/components/admin/settings/settings-field";
import { SettingsAssetCard } from "@/components/admin/settings/settings-asset-card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import type { MediaItem } from "@/lib/types";
import { Spinner } from "@/components/loading";
import { cn } from "@/lib/utils";

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
    canonicalUrl?: string;
    ogImage?: MediaItem;
  };
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsForm>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    setSaved(false);
    try {
      const updated = await adminApi.updateSettings(token, settings);
      setSettings(updated);
      setSaved(true);
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
      <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6 lg:p-8")}>
        <div className="flex items-start gap-4 mb-8">
          <span className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 admin-dark:bg-blue-900/30 admin-dark:text-blue-400">
            <Settings className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Site Settings</h1>
            <p className={cn("mt-1 text-sm sm:text-base", adminMutedClass)}>
              Manage your portfolio information and settings
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 lg:gap-8">
            <div className="space-y-5">
              <SettingsInputField
                label="Name"
                icon={User}
                value={settings.profileName || ""}
                onChange={(value) => setSettings({ ...settings, profileName: value })}
                placeholder="Your full name"
              />

              <SettingsInputField
                label="Tagline"
                icon={Sparkles}
                value={settings.heroHeading || ""}
                onChange={(value) => setSettings({ ...settings, heroHeading: value })}
                placeholder="Hi, I'm ..."
              />

              <SettingsTextareaField
                label="About / Bio"
                icon={FileText}
                value={settings.aboutText || ""}
                onChange={(value) => setSettings({ ...settings, aboutText: value })}
                maxLength={500}
                rows={4}
                placeholder="Write a short bio..."
              />

              <SettingsTextareaField
                label="Short Description"
                icon={FileText}
                value={settings.heroSubtitle || ""}
                onChange={(value) => setSettings({ ...settings, heroSubtitle: value })}
                maxLength={1000}
                rows={5}
                placeholder="Brief professional summary..."
              />

              <SettingsInputField
                label="Email"
                icon={Mail}
                type="email"
                value={settings.contactEmail || ""}
                onChange={(value) => setSettings({ ...settings, contactEmail: value })}
                placeholder="your@email.com"
              />

              <SettingsInputField
                label="Portfolio Title"
                icon={FolderKanban}
                value={settings.seo?.title || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, title: value },
                  })
                }
                placeholder="Portfolio title"
              />

              <SettingsTextareaField
                label="Portfolio Description"
                icon={FileText}
                value={settings.seo?.description || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, description: value },
                  })
                }
                maxLength={500}
                rows={4}
                placeholder="SEO description for your portfolio..."
              />

              <SettingsInputField
                label="Canonical URL"
                icon={Sparkles}
                value={settings.seo?.canonicalUrl || ""}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, canonicalUrl: value },
                  })
                }
                placeholder="https://yourdomain.com"
              />
            </div>

            <div className="space-y-4 xl:sticky xl:top-28 h-fit">
              <SettingsAssetCard
                mode="image"
                title="Logo"
                description="Upload your profile/logo image"
                resourceType="image"
                accept="image/*"
                folder="portfolio/branding"
                value={settings.logo || null}
                onChange={(media) => setSettings({ ...settings, logo: media as MediaItem })}
                disabled={saving}
              />

              <SettingsAssetCard
                mode="image"
                title="SEO / Social Preview Image"
                description="Used for Google, LinkedIn, and Twitter previews (1200x630 recommended)"
                resourceType="image"
                accept="image/*"
                folder="portfolio/seo"
                value={settings.seo?.ogImage || null}
                onChange={(media) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, ogImage: media as MediaItem },
                  })
                }
                disabled={saving}
              />

              <SettingsAssetCard
                mode="file"
                title="Resume (PDF or image)"
                description="Upload your resume file"
                accept="application/pdf,image/*"
                resourceType="auto"
                folder="portfolio/resume"
                value={settings.resume || null}
                onChange={(media) => setSettings({ ...settings, resume: media as MediaItem })}
                disabled={saving}
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Settings"}
              </button>

              {saved && (
                <p className="text-sm text-center text-emerald-600 admin-dark:text-emerald-400">
                  Settings saved successfully.
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}

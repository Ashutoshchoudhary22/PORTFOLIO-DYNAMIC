"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaUploader } from "@/components/admin/media-uploader";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { MediaItem, SectionVideo } from "@/lib/types";
import { Spinner } from "@/components/loading";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";

const SECTIONS = [
  { key: "hero", label: "Hero Section", description: "Main landing background" },
  { key: "about", label: "About Section", description: "About tab background" },
  { key: "services", label: "Services Section", description: "Services cards background" },
  { key: "projects", label: "Projects Section", description: "Projects grid background" },
  { key: "contact", label: "Contact Section", description: "Contact form background" },
  { key: "header", label: "Header / Navbar", description: "Top navigation background" },
  { key: "footer", label: "Footer", description: "Footer background" },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

function normalizeSectionVideos(items: SectionVideo[] = []) {
  return items.map((item) => ({
    section: item.section,
    media: {
      type: item.media.type,
      provider: item.media.provider || "cloudinary",
      publicId: item.media.publicId,
      secureUrl: item.media.secureUrl,
      thumbnailUrl: item.media.thumbnailUrl,
      format: item.media.format,
      width: item.media.width,
      height: item.media.height,
      duration: item.media.duration,
      bytes: item.media.bytes,
      sortOrder: item.media.sortOrder ?? 0,
      originalFilename: item.media.originalFilename,
    },
  }));
}

export default function AdminBackgroundsPage() {
  const [sectionVideos, setSectionVideos] = useState<SectionVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadBackgrounds = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;

    const data = await adminApi.getSettings(token);
    setSectionVideos(normalizeSectionVideos((data.sectionVideos as SectionVideo[]) || []));
  }, []);

  useEffect(() => {
    loadBackgrounds()
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Failed to load backgrounds.");
      })
      .finally(() => setLoading(false));
  }, [loadBackgrounds]);

  function getSectionMedia(section: SectionKey): MediaItem | null {
    return sectionVideos.find((item) => item.section === section)?.media || null;
  }

  async function persistBackgrounds(nextSections: SectionVideo[], successText: string) {
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    try {
      const payload = normalizeSectionVideos(nextSections);
      const updated = await adminApi.updateSettings(token, { sectionVideos: payload });
      setSectionVideos(normalizeSectionVideos((updated.sectionVideos as SectionVideo[]) || payload));
      setMessage(successText);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save backgrounds.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function handleSectionMediaChange(section: SectionKey, media: MediaItem | null) {
    const nextSections = sectionVideos.filter((item) => item.section !== section);
    if (media) {
      nextSections.push({ section, media });
    }

    setSectionVideos(nextSections);

    try {
      await persistBackgrounds(
        nextSections,
        media
          ? `${section} background saved successfully.`
          : `${section} background removed successfully.`
      );
    } catch {
      await loadBackgrounds();
    }
  }

  async function handleSaveAll() {
    try {
      await persistBackgrounds(sectionVideos, "All backgrounds saved successfully.");
    } catch {
      // error message already set
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
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-3xl font-bold">Background Media</h2>
          <p className={`mt-1 ${adminMutedClass}`}>
            Upload images or videos for each section. Each upload is saved automatically to the database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((section) => (
            <Card key={section.key} className={adminCardClass}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{section.label}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <MediaUploader
                  label="Background Image or Video"
                  accept="image/*,video/*"
                  resourceType="auto"
                  folder={`portfolio/backgrounds/${section.key}`}
                  value={getSectionMedia(section.key)}
                  onChange={(media) => handleSectionMediaChange(section.key, media)}
                  disabled={saving}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {message && (
          <p className={`text-sm ${message.includes("success") || message.includes("saved") || message.includes("removed") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}

        <Button onClick={handleSaveAll} disabled={saving}>
          {saving ? "Saving..." : "Re-save All Backgrounds"}
        </Button>
      </div>
    </AdminShell>
  );
}

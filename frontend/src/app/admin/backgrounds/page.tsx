"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Home,
  ImageIcon,
  LayoutGrid,
  Mail,
  PanelBottom,
  LogIn,
  PanelTop,
  Settings,
  User,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { BackgroundSectionCard } from "@/components/admin/backgrounds/background-section-card";
import { adminApi } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { adminMutedClass } from "@/lib/admin-styles";
import type { MediaItem, SectionVideo } from "@/lib/types";
import { Spinner } from "@/components/loading";

const SECTIONS = [
  {
    key: "hero",
    label: "Hero Section",
    description: "Main landing background",
    icon: Home,
    iconClass: "bg-violet-100 text-violet-600",
  },
  {
    key: "about",
    label: "About Section",
    description: "About section background",
    icon: User,
    iconClass: "bg-blue-100 text-blue-600",
  },
  {
    key: "services",
    label: "Services Section",
    description: "Services section background",
    icon: Settings,
    iconClass: "bg-teal-100 text-teal-600",
  },
  {
    key: "projects",
    label: "Projects Section",
    description: "Projects section background",
    icon: LayoutGrid,
    iconClass: "bg-purple-100 text-purple-600",
  },
  {
    key: "contact",
    label: "Contact Section",
    description: "Contact form background",
    icon: Mail,
    iconClass: "bg-pink-100 text-pink-600",
  },
  {
    key: "header",
    label: "Header / Navbar",
    description: "Top navigation background",
    icon: PanelTop,
    iconClass: "bg-cyan-100 text-cyan-600",
  },
  {
    key: "footer",
    label: "Footer",
    description: "Footer background",
    icon: PanelBottom,
    iconClass: "bg-indigo-100 text-indigo-600",
  },
  {
    key: "login",
    label: "Admin Login",
    description: "Login page background video",
    icon: LogIn,
    iconClass: "bg-rose-100 text-rose-600",
  },
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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save background.");
      await loadBackgrounds();
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
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="h-12 w-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 admin-dark:bg-violet-900/30 admin-dark:text-violet-400">
              <ImageIcon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Background Media</h1>
              <p className={`mt-1 text-sm sm:text-base max-w-2xl ${adminMutedClass}`}>
                Upload images or videos for each section. Each upload is saved automatically to the
                database.
              </p>
            </div>
          </div>

          <p className="hidden xl:block text-sm italic text-slate-400 admin-dark:text-white/40 max-w-[200px] text-right leading-relaxed">
            Make your portfolio more personal ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {SECTIONS.map((section) => (
            <BackgroundSectionCard
              key={section.key}
              title={section.label}
              description={section.description}
              icon={section.icon}
              iconClass={section.iconClass}
              folder={`portfolio/backgrounds/${section.key}`}
              value={getSectionMedia(section.key)}
              onChange={(media) => handleSectionMediaChange(section.key, media)}
              disabled={saving}
            />
          ))}
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.includes("success") || message.includes("saved") || message.includes("removed")
                ? "text-emerald-600 admin-dark:text-emerald-400"
                : "text-red-500 admin-dark:text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </AdminShell>
  );
}

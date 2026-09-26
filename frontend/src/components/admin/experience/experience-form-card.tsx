"use client";

import { useRef, useState } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  CloudUpload,
  FileText,
  Lightbulb,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUploadingIndicator } from "@/components/admin/admin-uploading-indicator";
import { AdminToggleField } from "@/components/admin/admin-toggle-field";
import { SettingsInputField } from "@/components/admin/settings/settings-field";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { getAdminToken } from "@/lib/admin-auth";
import type { ExperienceItem, MediaItem } from "@/lib/types";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type ExperienceFormCardProps = {
  form: Partial<ExperienceItem>;
  editingId: string | null;
  saving: boolean;
  message: string | null;
  onChange: (updates: Partial<ExperienceItem>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
  onIconChange: (media: MediaItem | null) => void;
};

function iconUrlToMedia(url?: string): MediaItem | null {
  if (!url?.trim()) return null;
  return {
    type: "image",
    provider: "cloudinary",
    publicId: url,
    secureUrl: url,
  };
}

export function ExperienceFormCard({
  form,
  editingId,
  saving,
  message,
  onChange,
  onSubmit,
  onCancel,
  onIconChange,
}: ExperienceFormCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const iconMedia = iconUrlToMedia(form.iconUrl);

  async function handleIconUpload(file: File) {
    const token = getAdminToken();
    if (!token) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be 10MB or smaller.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, token, {
        folder: "portfolio/experience",
        resourceType: "image",
        onProgress: (p) => setProgress(p.percentage),
      });

      onIconChange({
        type: "image",
        provider: "cloudinary",
        publicId: String(result.public_id),
        secureUrl: String(result.secure_url),
        format: String(result.format || ""),
        originalFilename: file.name,
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-start gap-3 mb-6">
        <span className="h-11 w-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 admin-dark:bg-violet-900/30 admin-dark:text-violet-400">
          <Briefcase className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Experience Details</h2>
          <p className={cn("text-sm", adminMutedClass)}>
            {editingId ? "Update this work experience entry." : "Add a new role to your portfolio."}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <SettingsInputField
          label="Role"
          icon={Briefcase}
          value={form.role || ""}
          onChange={(value) => onChange({ role: value })}
          placeholder="e.g. Full Stack Developer"
        />

        <SettingsInputField
          label="Company"
          icon={Building2}
          value={form.company || ""}
          onChange={(value) => onChange({ company: value })}
          placeholder="e.g. Google, Microsoft, etc."
        />

        <SettingsInputField
          label="Period"
          icon={Calendar}
          value={form.period || ""}
          onChange={(value) => onChange({ period: value })}
          placeholder="e.g. Jan 2022 – Present"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 admin-dark:text-slate-200">
            Description
          </label>
          <div className="relative rounded-xl border border-slate-200 bg-white admin-dark:border-white/10 admin-dark:bg-slate-900">
            <FileText className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <textarea
              value={form.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={5}
              required
              placeholder="Describe your responsibilities, achievements and what you did..."
              className="w-full resize-none rounded-xl border-0 bg-transparent pl-10 pr-4 py-3 text-sm outline-none admin-dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 admin-dark:text-slate-200">
            Company Logo
          </label>
          <button
            type="button"
            disabled={uploading || saving}
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-left hover:bg-slate-100 transition-colors admin-dark:border-white/10 admin-dark:bg-slate-800/50 admin-dark:hover:bg-slate-800"
          >
            <CloudUpload className="h-5 w-5 text-blue-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-600 admin-dark:text-blue-400">
                {uploading ? "Uploading..." : "Choose file"}
              </p>
              {!uploading && (
                <p className={cn("text-xs", adminMutedClass)}>Recommended size: 64x64px (PNG, SVG)</p>
              )}
            </div>
            {iconMedia?.secureUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconMedia.secureUrl}
                alt="Company logo"
                className="ml-auto h-10 w-10 rounded-xl object-contain bg-white border border-slate-200 admin-dark:bg-slate-900 admin-dark:border-white/10"
              />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleIconUpload(file);
            }}
          />
          {uploading && <AdminUploadingIndicator progress={progress} />}
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
        </div>

        <AdminToggleField
          label="Active"
          description="Show this experience on your portfolio."
          checked={Boolean(form.isActive)}
          onCheckedChange={(checked) => onChange({ isActive: checked })}
        />

        {message && (
          <p
            className={`text-sm ${
              message.includes("success") ? "text-emerald-600 admin-dark:text-emerald-400" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2.5 admin-dark:bg-blue-900/20">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className={cn("text-xs sm:text-sm", adminMutedClass)}>
              {editingId
                ? "Update Experience. Changes will appear in the list on the right."
                : "Create Experience. Your entry will be added to the list on the right."}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {editingId && (
              <Button type="button" variant="outline" className="rounded-xl" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white px-5 shadow-md shadow-blue-500/20"
            >
              <Plus className="h-4 w-4 mr-1" />
              {saving ? "Saving..." : editingId ? "Update Experience" : "Add Experience"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

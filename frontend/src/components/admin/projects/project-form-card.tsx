"use client";

import { useRef, useState } from "react";
import {
  CloudUpload,
  FileText,
  FolderKanban,
  Github,
  Globe,
  Lightbulb,
  Link2,
  Pencil,
  Plus,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUploadingIndicator } from "@/components/admin/admin-uploading-indicator";
import { AdminToggleField } from "@/components/admin/admin-toggle-field";
import { SettingsInputField } from "@/components/admin/settings/settings-field";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { getAdminToken } from "@/lib/admin-auth";
import { downloadMedia } from "@/lib/media-utils";
import type { MediaItem, ProjectItem } from "@/lib/types";
import { adminBorderClass, adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type ProjectFormCardProps = {
  form: Partial<ProjectItem>;
  tagsInput: string;
  editingId: string | null;
  saving: boolean;
  message: string | null;
  onChange: (updates: Partial<ProjectItem>) => void;
  onTagsChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
  onThumbnailChange: (media: MediaItem | null) => void;
  onAddMedia: (media: MediaItem | null) => void;
  onRemoveMedia: (index: number) => void;
  onClearMedia: () => void;
};

function MediaPreview({ media }: { media: MediaItem }) {
  return (
    <div className={`rounded-xl border p-2 space-y-2 ${adminBorderClass}`}>
      {media.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.secureUrl}
          alt={media.originalFilename || media.publicId}
          className="h-20 w-full object-cover rounded-lg"
        />
      ) : (
        <video src={media.secureUrl} controls className="h-20 w-full object-cover rounded-lg" />
      )}
      <p className="text-xs truncate">{media.originalFilename || media.publicId}</p>
    </div>
  );
}

function UploadField({
  label,
  hint,
  accept,
  resourceType,
  disabled,
  previewUrl,
  onUpload,
}: {
  label: string;
  hint: string;
  accept: string;
  resourceType: "image" | "video" | "auto";
  disabled?: boolean;
  previewUrl?: string;
  onUpload: (file: File, setProgress: (value: number) => void) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      await onUpload(file, setProgress);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 admin-dark:text-slate-200">{label}</label>
      <button
        type="button"
        disabled={uploading || disabled}
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 transition-colors admin-dark:border-white/10 admin-dark:bg-slate-800/50 admin-dark:hover:bg-slate-800"
      >
        <CloudUpload className="h-5 w-5 text-blue-500 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-blue-600 admin-dark:text-blue-400">
            {uploading ? "Uploading..." : "Choose file"}
          </p>
          {!uploading && <p className={cn("text-xs", adminMutedClass)}>{hint}</p>}
        </div>
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            className="ml-auto h-10 w-14 rounded-lg object-cover border border-slate-200 admin-dark:border-white/10"
          />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading || disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      {uploading && <AdminUploadingIndicator progress={progress} />}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function ProjectFormCard({
  form,
  tagsInput,
  editingId,
  saving,
  message,
  onChange,
  onTagsChange,
  onSubmit,
  onCancel,
  onThumbnailChange,
  onAddMedia,
  onRemoveMedia,
  onClearMedia,
}: ProjectFormCardProps) {
  async function uploadFile(file: File, resourceType: "image" | "video", setProgress: (value: number) => void) {
    const token = getAdminToken();
    if (!token) throw new Error("Not authenticated");

    const maxBytes = resourceType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(resourceType === "video" ? "Video must be 100MB or smaller." : "Image must be 10MB or smaller.");
    }

    const result = await uploadToCloudinary(file, token, {
      folder: "portfolio/projects",
      resourceType,
      onProgress: (p) => setProgress(p.percentage),
    });

    const isVideo = result.resource_type === "video" || file.type.startsWith("video/");
    return {
      type: isVideo ? "video" as const : "image" as const,
      provider: "cloudinary" as const,
      publicId: String(result.public_id),
      secureUrl: String(result.secure_url),
      thumbnailUrl: isVideo
        ? String(result.secure_url).replace(/\.[^.]+$/, ".jpg")
        : String(result.secure_url),
      format: String(result.format || ""),
      width: Number(result.width || 0),
      height: Number(result.height || 0),
      duration: Number(result.duration || 0),
      bytes: Number(result.bytes || 0),
      originalFilename: file.name,
    } satisfies MediaItem;
  }

  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-start gap-3 mb-6">
        <span className="h-11 w-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 admin-dark:bg-violet-900/30 admin-dark:text-violet-400">
          <FolderKanban className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{editingId ? "Edit Project" : "Add Project"}</h2>
          <p className={cn("text-sm", adminMutedClass)}>
            Showcase your amazing projects to the world.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <SettingsInputField
          label="Title *"
          icon={Pencil}
          value={form.title || ""}
          onChange={(value) => onChange({ title: value })}
          placeholder="e.g. E-commerce Website"
        />

        <SettingsInputField
          label="Slug (optional)"
          icon={Link2}
          value={form.slug || ""}
          onChange={(value) => onChange({ slug: value })}
          placeholder="e.g. ecommerce-website"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 admin-dark:text-slate-200">
            Description *
          </label>
          <div className="relative rounded-xl border border-slate-200 bg-white admin-dark:border-white/10 admin-dark:bg-slate-900">
            <FileText className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <textarea
              value={form.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={4}
              required
              placeholder="Project description, features, technologies used..."
              className="w-full resize-none rounded-xl border-0 bg-transparent pl-10 pr-4 py-3 text-sm outline-none admin-dark:text-white"
            />
          </div>
        </div>

        <SettingsInputField
          label="Tags (comma separated)"
          icon={Tags}
          value={tagsInput}
          onChange={onTagsChange}
          placeholder="e.g. React, Node.js, MongoDB"
        />

        <SettingsInputField
          label="Live URL"
          icon={Globe}
          value={form.liveUrl || ""}
          onChange={(value) => onChange({ liveUrl: value })}
          placeholder="https://example.com"
        />

        <SettingsInputField
          label="GitHub URL"
          icon={Github}
          value={form.githubUrl || ""}
          onChange={(value) => onChange({ githubUrl: value })}
          placeholder="https://github.com/username/project"
        />

        <AdminToggleField
          label="Featured"
          description="Show in featured section."
          checked={Boolean(form.featured)}
          onCheckedChange={(checked) => onChange({ featured: checked })}
        />

        <UploadField
          label="Main Thumbnail"
          hint="Recommended size: 1200x630px (JPG, PNG, SVG)"
          accept="image/*"
          resourceType="image"
          disabled={saving}
          previewUrl={form.thumbnail?.secureUrl}
          onUpload={async (file, setProgress) => {
            const media = await uploadFile(file, "image", setProgress);
            onThumbnailChange(media);
          }}
        />

        <UploadField
          label="Add Project Images"
          hint="Optional additional project images"
          accept="image/*"
          resourceType="image"
          disabled={saving}
          onUpload={async (file, setProgress) => {
            const media = await uploadFile(file, "image", setProgress);
            onAddMedia(media);
          }}
        />

        <UploadField
          label="Add Project Video"
          hint="Upload video file or paste YouTube link separately"
          accept="video/*"
          resourceType="video"
          disabled={saving}
          onUpload={async (file, setProgress) => {
            const media = await uploadFile(file, "video", setProgress);
            onAddMedia(media);
          }}
        />

        {(form.media || []).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">Project Media Gallery</p>
              <Button type="button" size="sm" variant="outline" className="rounded-lg" onClick={onClearMedia}>
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(form.media || []).map((media, index) => (
                <div key={`${media.publicId}-${index}`} className="space-y-2">
                  <MediaPreview media={media} />
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" className="rounded-lg flex-1" onClick={() => downloadMedia(media)}>
                      Download
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="rounded-lg flex-1" onClick={() => onRemoveMedia(index)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {message && (
          <p
            className={`text-sm ${
              message.includes("success") ? "text-emerald-600 admin-dark:text-emerald-400" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2.5 admin-dark:bg-blue-900/20">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className={cn("text-xs sm:text-sm", adminMutedClass)}>
              {editingId
                ? "Update Project. Changes will appear in the list on the right."
                : "Create Project. Your project will be added to the list on the right."}
            </p>
          </div>

          {editingId && (
            <Button type="button" variant="outline" className="rounded-xl w-full sm:w-auto" onClick={onCancel}>
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white h-12 shadow-md shadow-blue-500/20"
          >
            <Plus className="h-4 w-4 mr-1" />
            {saving ? "Saving..." : editingId ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
}

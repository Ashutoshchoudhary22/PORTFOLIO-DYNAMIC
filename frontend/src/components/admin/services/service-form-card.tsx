"use client";

import { useRef, useState } from "react";
import {
  Code2,
  FileText,
  ImageIcon,
  Lightbulb,
  Plus,
  Type,
  Video,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AdminToggleField } from "@/components/admin/admin-toggle-field";
import { SettingsInputField } from "@/components/admin/settings/settings-field";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { getAdminToken } from "@/lib/admin-auth";
import type { MediaItem, ServiceItem } from "@/lib/types";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type ServiceFormCardProps = {
  form: Partial<ServiceItem>;
  editingId: string | null;
  saving: boolean;
  message: string | null;
  onChange: (updates: Partial<ServiceItem>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
};

function UploadField({
  label,
  icon: Icon,
  accept,
  resourceType,
  disabled,
  previewUrl,
  onUploaded,
}: {
  label: string;
  icon: typeof ImageIcon;
  accept: string;
  resourceType: "image" | "video";
  disabled?: boolean;
  previewUrl?: string;
  onUploaded: (media: MediaItem) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    const token = getAdminToken();
    if (!token) return;

    const maxBytes = resourceType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(resourceType === "video" ? "Video must be 100MB or smaller." : "Image must be 10MB or smaller.");
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, token, {
        folder: "portfolio/services",
        resourceType,
        onProgress: (p) => setProgress(p.percentage),
      });

      const isVideo = result.resource_type === "video" || file.type.startsWith("video/");
      onUploaded({
        type: isVideo ? "video" : "image",
        provider: "cloudinary",
        publicId: String(result.public_id),
        secureUrl: String(result.secure_url),
        thumbnailUrl: isVideo
          ? String(result.secure_url).replace(/\.[^.]+$/, ".jpg")
          : String(result.secure_url),
        format: String(result.format || ""),
        originalFilename: file.name,
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 admin-dark:text-slate-200 flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-400" />
        {label}
      </label>
      <button
        type="button"
        disabled={uploading || disabled}
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 transition-colors admin-dark:border-white/10 admin-dark:bg-slate-800/50 admin-dark:hover:bg-slate-800"
      >
        <span className="text-sm font-medium text-blue-600 admin-dark:text-blue-400">Choose file</span>
        <span className={cn("text-sm", adminMutedClass)}>
          {previewUrl ? "File selected" : "No file chosen"}
        </span>
        {previewUrl && resourceType === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Preview"
            className="ml-auto h-10 w-10 rounded-lg object-cover border border-slate-200 admin-dark:border-white/10"
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
      {uploading && <Progress value={progress} />}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function ServiceFormCard({
  form,
  editingId,
  saving,
  message,
  onChange,
  onSubmit,
  onCancel,
}: ServiceFormCardProps) {
  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-start gap-3 mb-6">
        <span className="h-11 w-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 admin-dark:bg-violet-900/30 admin-dark:text-violet-400">
          <Wrench className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{editingId ? "Edit Service" : "Add Service"}</h2>
          <p className={cn("text-sm", adminMutedClass)}>
            Add a new service to showcase your technical expertise.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <SettingsInputField
          label="Title *"
          icon={Type}
          value={form.title || ""}
          onChange={(value) => onChange({ title: value })}
          placeholder="e.g. Web Development"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 admin-dark:text-slate-200 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            Description
          </label>
          <textarea
            value={form.description || ""}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={4}
            required
            placeholder="Describe the service in detail..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 admin-dark:border-white/10 admin-dark:bg-slate-900 admin-dark:text-white"
          />
        </div>

        <SettingsInputField
          label="Code"
          icon={Code2}
          value={form.code || ""}
          onChange={(value) => onChange({ code: value })}
          placeholder="e.g. SV001"
        />

        <UploadField
          label="Service Image"
          icon={ImageIcon}
          accept="image/*"
          resourceType="image"
          disabled={saving}
          previewUrl={form.image?.secureUrl}
          onUploaded={(media) => onChange({ image: media })}
        />

        <UploadField
          label="Service Video"
          icon={Video}
          accept="video/*"
          resourceType="video"
          disabled={saving}
          previewUrl={form.video?.thumbnailUrl || form.video?.secureUrl}
          onUploaded={(media) => onChange({ video: media })}
        />

        <AdminToggleField
          label="Active"
          description="Show this service on your portfolio."
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

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2.5 admin-dark:bg-blue-900/20">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className={cn("text-xs sm:text-sm", adminMutedClass)}>
              {editingId
                ? "Update Service. Changes will appear in the list on the right."
                : "Create Service. Your service will be added to the list on the right."}
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
            {saving ? "Saving..." : editingId ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}

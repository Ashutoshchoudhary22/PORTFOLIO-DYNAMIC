"use client";

import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Download, MoreVertical, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { downloadMedia } from "@/lib/media-utils";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { getAdminToken } from "@/lib/admin-auth";
import type { MediaItem } from "@/lib/types";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type BackgroundSectionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  folder: string;
  value?: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  disabled?: boolean;
};

export function BackgroundSectionCard({
  title,
  description,
  icon: Icon,
  iconClass,
  folder,
  value,
  onChange,
  disabled = false,
}: BackgroundSectionCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fileName = value?.originalFilename || (value?.secureUrl ? value.secureUrl.split("/").pop() : null);
  const isVideo = value?.type === "video" || value?.secureUrl?.match(/\.(mp4|webm|mov)(\?|$)/i);

  async function handleUpload(file: File) {
    const token = getAdminToken();
    if (!token) return;

    const maxBytes = file.type.startsWith("video/") ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(
        file.type.startsWith("video/")
          ? "Video must be 100MB or smaller."
          : "Image must be 10MB or smaller."
      );
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, token, {
        folder,
        resourceType: "auto",
        onProgress: (p) => setProgress(p.percentage),
      });

      const uploadedIsVideo = result.resource_type === "video" || file.type.startsWith("video/");
      onChange({
        type: uploadedIsVideo ? "video" : "image",
        provider: "cloudinary",
        publicId: String(result.public_id),
        secureUrl: String(result.secure_url),
        thumbnailUrl: uploadedIsVideo
          ? String(result.secure_url).replace(/\.[^.]+$/, ".jpg")
          : String(result.secure_url),
        format: String(result.format || ""),
        width: Number(result.width || 0),
        height: Number(result.height || 0),
        duration: Number(result.duration || 0),
        bytes: Number(result.bytes || 0),
        originalFilename: file.name,
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 space-y-4")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
              iconClass
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-base">{title}</h3>
            <p className={cn("text-sm mt-0.5", adminMutedClass)}>{description}</p>
          </div>
        </div>
        <button
          type="button"
          className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center shrink-0 admin-dark:hover:bg-slate-800"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        disabled={uploading || disabled}
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm hover:bg-slate-100 transition-colors admin-dark:border-white/10 admin-dark:bg-slate-800/50 admin-dark:hover:bg-slate-800"
      >
        <Upload className="h-4 w-4 text-slate-400 shrink-0" />
        <span className="text-slate-500 admin-dark:text-white/60">Choose file</span>
        <span className="text-slate-400 truncate admin-dark:text-white/40">
          {fileName || "No file chosen"}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        disabled={uploading || disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {uploading && <Progress value={progress} />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {value?.secureUrl && (
        <div className="space-y-3">
          {fileName && (
            <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 admin-dark:bg-blue-900/30 admin-dark:text-blue-400">
              {fileName}
            </span>
          )}

          <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-200 admin-dark:border-white/10">
            {isVideo ? (
              <video
                src={value.secureUrl}
                controls
                className="w-full max-h-44 object-cover bg-black"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value.secureUrl}
                alt={fileName || title}
                className="w-full max-h-44 object-cover"
              />
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!value}
              className="flex-1 rounded-xl border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 admin-dark:border-blue-900/50 admin-dark:bg-blue-900/20 admin-dark:text-blue-400"
              onClick={() => downloadMedia(value)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!value || disabled}
              className="flex-1 rounded-xl border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 admin-dark:border-pink-900/50 admin-dark:bg-pink-900/20 admin-dark:text-pink-400"
              onClick={() => onChange(null)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

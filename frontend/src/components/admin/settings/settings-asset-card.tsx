"use client";

import { useRef, useState } from "react";
import { Download, FileText, ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUploadingIndicator } from "@/components/admin/admin-uploading-indicator";
import { downloadMedia } from "@/lib/media-utils";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { getAdminToken } from "@/lib/admin-auth";
import type { MediaItem } from "@/lib/types";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type SettingsAssetCardProps = {
  title: string;
  description: string;
  accept?: string;
  folder?: string;
  resourceType?: "auto" | "image" | "video";
  value?: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  disabled?: boolean;
  mode: "image" | "file";
};

export function SettingsAssetCard({
  title,
  description,
  accept = "image/*",
  folder = "portfolio",
  resourceType = "image",
  value,
  onChange,
  disabled = false,
  mode,
}: SettingsAssetCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleUpload(file: File) {
    const token = getAdminToken();
    if (!token) return;

    const maxBytes = file.type.startsWith("video/") ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(file.type.startsWith("video/") ? "Video must be 100MB or smaller." : "File must be 10MB or smaller.");
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(file, token, {
        folder,
        resourceType,
        onProgress: (p) => setProgress(p.percentage),
      });

      const isVideo = result.resource_type === "video" || file.type.startsWith("video/");
      const isPdf = file.type === "application/pdf" || String(result.format).toLowerCase() === "pdf";

      onChange({
        type: isVideo ? "video" : "image",
        provider: "cloudinary",
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
        ...(isPdf ? { type: "image" as const } : {}),
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  const hasFile = Boolean(value?.secureUrl);
  const isPdf =
    value?.originalFilename?.toLowerCase().endsWith(".pdf") ||
    value?.secureUrl?.toLowerCase().includes(".pdf");

  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 space-y-4")}>
      <div className="flex items-start gap-3">
        <span className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 admin-dark:bg-blue-900/30 admin-dark:text-blue-400">
          {mode === "image" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        </span>
        <div>
          <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
          <p className={cn("text-xs sm:text-sm mt-0.5", adminMutedClass)}>{description}</p>
        </div>
      </div>

      {mode === "image" && hasFile && value?.type === "image" && !isPdf ? (
        <button
          type="button"
          disabled={uploading || disabled}
          onClick={() => fileInputRef.current?.click()}
          className="flex justify-center w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.secureUrl}
            alt={value.originalFilename || "Logo preview"}
            className="h-28 w-28 rounded-2xl object-cover border border-slate-100 shadow-sm admin-dark:border-white/10"
          />
        </button>
      ) : (
        <button
          type="button"
          disabled={uploading || disabled}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "w-full rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragOver
              ? "border-blue-400 bg-blue-50/50 admin-dark:bg-blue-900/20"
              : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 admin-dark:border-white/10 admin-dark:bg-slate-800/50 admin-dark:hover:bg-slate-800"
          )}
        >
          <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center admin-dark:bg-slate-900 admin-dark:border-white/10">
            {isPdf || mode === "file" ? (
              <FileText className="h-6 w-6 text-blue-500" />
            ) : (
              <Upload className="h-6 w-6 text-blue-500" />
            )}
          </div>
          <p className="text-sm font-medium">
            {uploading ? "Uploading..." : hasFile ? value?.originalFilename || "File uploaded" : "No file chosen"}
          </p>
          {!uploading && (
            <p className={cn("text-xs mt-1", adminMutedClass)}>
              <span className="text-blue-600 admin-dark:text-blue-400">Choose file</span> or drag and drop
            </p>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading || disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {uploading && <AdminUploadingIndicator progress={progress} />}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <Button
          type="button"
          disabled={!hasFile}
          className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => value && downloadMedia(value)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!hasFile}
          className="flex-1 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 admin-dark:border-red-900/50 admin-dark:hover:bg-red-900/20"
          onClick={() => onChange(null)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
}

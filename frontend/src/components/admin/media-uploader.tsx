"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { downloadMedia } from "@/lib/media-utils";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { getAdminToken } from "@/lib/admin-auth";
import type { MediaItem } from "@/lib/types";

interface MediaUploaderProps {
  label: string;
  accept?: string;
  folder?: string;
  resourceType?: "auto" | "image" | "video";
  value?: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  disabled?: boolean;
}

export function MediaUploader({
  label,
  accept = "image/*,video/*",
  folder = "portfolio",
  resourceType = "auto",
  value,
  onChange,
  disabled = false,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
        resourceType,
        onProgress: (p) => setProgress(p.percentage),
      });

      const isVideo = result.resource_type === "video" || file.type.startsWith("video/");
      onChange({
        type: isVideo ? "video" : "image",
        provider: "cloudinary",
        publicId: String(result.public_id),
        secureUrl: String(result.secure_url),
        thumbnailUrl: isVideo ? String(result.secure_url).replace(/\.[^.]+$/, ".jpg") : String(result.secure_url),
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
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Input
        type="file"
        accept={accept}
        disabled={uploading || disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      {uploading && <Progress value={progress} />}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {value?.secureUrl && (
        <div className="rounded-md border border-white/10 p-2 text-xs space-y-2">
          <p className="truncate">{value.originalFilename || value.publicId}</p>
          {value.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.secureUrl} alt="Preview" className="max-h-32 rounded" />
          ) : (
            <video src={value.secureUrl} controls className="max-h-32 rounded w-full" />
          )}
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => downloadMedia(value)}>
              Download
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => onChange(null)}>
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

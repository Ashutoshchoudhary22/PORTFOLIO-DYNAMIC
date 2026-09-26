"use client";

import {
  Building2,
  Calendar,
  FileText,
  GraduationCap,
  Lightbulb,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminToggleField } from "@/components/admin/admin-toggle-field";
import { SettingsInputField } from "@/components/admin/settings/settings-field";
import type { EducationItem } from "@/lib/types";
import { adminCardClass, adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type EducationFormCardProps = {
  form: Partial<EducationItem>;
  editingId: string | null;
  saving: boolean;
  message: string | null;
  onChange: (updates: Partial<EducationItem>) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
};

export function EducationFormCard({
  form,
  editingId,
  saving,
  message,
  onChange,
  onSubmit,
  onCancel,
}: EducationFormCardProps) {
  return (
    <div className={cn(adminCardClass, "rounded-2xl p-5 sm:p-6")}>
      <div className="flex items-start gap-3 mb-6">
        <span className="h-11 w-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 admin-dark:bg-violet-900/30 admin-dark:text-violet-400">
          <GraduationCap className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Education" : "Add Education"}
          </h2>
          <p className={cn("text-sm", adminMutedClass)}>
            Fill in the details about your education background.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <SettingsInputField
          label="Degree"
          icon={GraduationCap}
          value={form.degree || ""}
          onChange={(value) => onChange({ degree: value })}
          placeholder="e.g. B.Tech, Bachelor of Science, etc."
        />

        <SettingsInputField
          label="Institute / College"
          icon={Building2}
          value={form.institution || ""}
          onChange={(value) => onChange({ institution: value })}
          placeholder="e.g. ABC University, XYZ College"
        />

        <SettingsInputField
          label="Period"
          icon={Calendar}
          value={form.period || ""}
          onChange={(value) => onChange({ period: value })}
          placeholder="e.g. 2018 - 2022"
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
              placeholder="Describe your course, achievements, focus area, etc..."
              className="w-full resize-none rounded-xl border-0 bg-transparent pl-10 pr-4 py-3 text-sm outline-none admin-dark:text-white"
            />
          </div>
        </div>

        <AdminToggleField
          label="Active"
          description="Show this education on your portfolio."
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
                ? "Update Education. Changes will appear in the list on the right."
                : "Create Education. Your entry will be added to the list on the right."}
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
            {saving ? "Saving..." : editingId ? "Update Education" : "Add Education"}
          </Button>
        </div>
      </form>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { adminMutedClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

type SettingsFieldProps = {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
};

export function SettingsField({ label, icon: Icon, children, className }: SettingsFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-slate-700 admin-dark:text-slate-200">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-10" />
        {children}
      </div>
    </div>
  );
}

type SettingsTextareaFieldProps = {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  rows?: number;
  placeholder?: string;
};

export function SettingsTextareaField({
  label,
  icon: Icon,
  value,
  onChange,
  maxLength,
  rows = 4,
  placeholder,
}: SettingsTextareaFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 admin-dark:text-slate-200">{label}</label>
      <div className="relative rounded-xl border border-slate-200 bg-white admin-dark:border-white/10 admin-dark:bg-slate-900">
        <Icon className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          rows={rows}
          placeholder={placeholder}
          className="w-full resize-none rounded-xl border-0 bg-transparent pl-10 pr-4 pt-3 pb-8 text-sm outline-none admin-dark:text-white"
        />
        <span className={`absolute bottom-2 right-3 text-xs ${adminMutedClass}`}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

type SettingsInputFieldProps = {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

export function SettingsInputField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: SettingsInputFieldProps) {
  return (
    <SettingsField label={label} icon={Icon}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 admin-dark:border-white/10 admin-dark:bg-slate-900 admin-dark:text-white admin-dark:focus:ring-blue-900/40"
      />
    </SettingsField>
  );
}

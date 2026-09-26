export function AdminBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md ${
          compact ? "h-9 w-9 text-base" : "h-11 w-11 text-lg"
        }`}
      >
        P
      </div>
      <div className="min-w-0">
        <p className={`font-semibold truncate ${compact ? "text-sm" : "text-base"}`}>
          Portfolio Admin
        </p>
        <p className="text-xs text-slate-400 admin-dark:text-white/50 truncate">
          Control Panel
        </p>
      </div>
    </div>
  );
}

export type AdminTheme = "light" | "dark";

const STORAGE_KEY = "admin-theme";

export function getAdminTheme(): AdminTheme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

export function setAdminThemeStorage(theme: AdminTheme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

export type AdminTheme = "light" | "dark";

const STORAGE_KEY = "admin-theme";

export function getAdminTheme(): AdminTheme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "light";
}

export function setAdminThemeStorage(theme: AdminTheme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

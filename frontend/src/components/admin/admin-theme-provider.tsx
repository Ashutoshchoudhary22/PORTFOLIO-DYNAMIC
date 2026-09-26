"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  type AdminTheme,
  getAdminTheme,
  setAdminThemeStorage,
} from "@/lib/admin-theme";
import { adminShellClass } from "@/lib/admin-styles";

type AdminThemeContextValue = {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
};

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

function applyAdminTheme(theme: AdminTheme) {
  document.documentElement.setAttribute("data-admin-theme", theme);
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("light");

  useEffect(() => {
    const stored = getAdminTheme();
    setThemeState(stored);
    applyAdminTheme(stored);
  }, []);

  useEffect(() => {
    applyAdminTheme(theme);
  }, [theme]);

  function setTheme(next: AdminTheme) {
    setThemeState(next);
    setAdminThemeStorage(next);
    applyAdminTheme(next);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        data-admin-theme={theme}
        className={cn("admin-theme min-h-full", theme === "dark" && "dark", adminShellClass)}
        suppressHydrationWarning
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}

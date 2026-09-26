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

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getAdminTheme());
    setMounted(true);
  }, []);

  function setTheme(next: AdminTheme) {
    setThemeState(next);
    setAdminThemeStorage(next);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        className={cn(
          "admin-theme",
          mounted && theme === "dark" && "dark",
          adminShellClass
        )}
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

import type { Metadata } from "next";
import Script from "next/script";
import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";

export const metadata: Metadata = {
  title: "Admin Panel | Portfolio",
  robots: { index: false, follow: false },
};

const adminThemeScript = `
(function () {
  try {
    var theme = localStorage.getItem("admin-theme");
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-admin-theme", theme);
    }
  } catch (e) {}
})();
`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="admin-theme-init" strategy="beforeInteractive">
        {adminThemeScript}
      </Script>
      <AdminThemeProvider>{children}</AdminThemeProvider>
    </>
  );
}

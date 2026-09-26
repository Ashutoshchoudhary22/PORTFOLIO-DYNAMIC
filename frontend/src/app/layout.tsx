import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LoadingAnimation } from "@/components/loading";
import { AppProviders } from "@/components/providers";
import { DEFAULT_SEO, getSiteUrl } from "@/lib/site-config";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070b14",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: DEFAULT_SEO.title,
    template: "%s | Ashutosh Choudhary",
  },
  description: DEFAULT_SEO.description,
  keywords: DEFAULT_SEO.keywords,
  applicationName: "Ashutosh Choudhary Portfolio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/main-logo2.png",
    apple: "/main-logo2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          <LoadingAnimation />
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}

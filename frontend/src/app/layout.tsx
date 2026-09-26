import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LoadingAnimation } from "@/components/loading";
import { AppProviders } from "@/components/providers";

export const metadata: Metadata = {
  title: 'Ashutosh Choudhary Portfolio',
  description: 'Portfolio of Ashutosh Choudhary, a Full Stack Developer specializing in MERN, SaaS, HRM, CRM, and enterprise dashboards.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
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

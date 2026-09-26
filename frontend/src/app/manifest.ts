import type { MetadataRoute } from "next";
import { DEFAULT_SEO, getSiteUrl } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: DEFAULT_SEO.title,
    short_name: "Ashutosh Portfolio",
    description: DEFAULT_SEO.description,
    start_url: "/",
    display: "standalone",
    background_color: "#070b14",
    theme_color: "#3b82f6",
    lang: "en-IN",
    icons: [
      {
        src: "/main-logo2.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    id: getSiteUrl(),
  };
}

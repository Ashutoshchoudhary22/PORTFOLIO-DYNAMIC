import type { Metadata } from "next";
import type { ProfileData } from "./types";
import { DEFAULT_SEO, getSiteUrl } from "./site-config";

function resolveImageUrl(profile: ProfileData | null) {
  const ogImage =
    profile?.seo?.ogImage?.secureUrl ||
    profile?.logo?.secureUrl ||
    "/main-logo2.png";

  if (ogImage.startsWith("http")) return ogImage;
  return `${getSiteUrl()}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;
}

function buildKeywords(profile: ProfileData | null) {
  const dynamic = [
    profile?.name,
    profile?.heroHeading,
    profile?.heroSubtitle,
    profile?.aboutText,
    ...(profile?.socialLinks?.map((link) => link.platform) || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const merged = [...DEFAULT_SEO.keywords];

  ["mern", "react", "node", "typescript", "saas", "crm", "hrm", "dashboard"].forEach(
    (keyword) => {
      if (dynamic.includes(keyword) && !merged.some((k) => k.toLowerCase() === keyword)) {
        merged.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
  );

  return merged.slice(0, 20);
}

export function buildPortfolioMetadata(profile: ProfileData | null): Metadata {
  const siteUrl = getSiteUrl();
  const title =
    profile?.seo?.title ||
    profile?.heroHeading ||
    DEFAULT_SEO.title;
  const description =
    profile?.seo?.description ||
    profile?.heroSubtitle ||
    profile?.aboutText ||
    DEFAULT_SEO.description;
  const canonical = profile?.seo?.canonicalUrl || siteUrl;
  const imageUrl = resolveImageUrl(profile);
  const keywords = buildKeywords(profile);

  return {
    title,
    description,
    keywords,
    authors: [{ name: profile?.name || "Ashutosh Choudhary" }],
    creator: profile?.name || "Ashutosh Choudhary",
    publisher: profile?.name || "Ashutosh Choudhary",
    category: "technology",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: profile?.name || "Ashutosh Choudhary Portfolio",
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${profile?.name || "Ashutosh Choudhary"} portfolio preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: profile?.contactEmail
      ? {
          "contact:email": profile.contactEmail,
        }
      : undefined,
  };
}

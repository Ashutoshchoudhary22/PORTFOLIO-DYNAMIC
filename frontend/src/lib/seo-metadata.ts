import type { Metadata } from "next";
import type { ProfileData } from "./types";
import { BRAND_NAME, DEFAULT_SEO, getSiteUrl } from "./site-config";

function personName(profile: ProfileData | null) {
  const name = profile?.name?.trim();
  if (name && name.toLowerCase().includes("ashutosh")) return name;
  return BRAND_NAME;
}

function buildTitle(profile: ProfileData | null) {
  const name = personName(profile);
  const optimized = `${name} Portfolio | Full Stack Developer`;
  const custom = profile?.seo?.title?.trim();
  if (!custom) return optimized;

  const lower = custom.toLowerCase();
  const branded =
    lower.includes(name.toLowerCase()) && lower.includes("portfolio");
  if (branded && custom.length >= 40 && custom.length <= 65) return custom;
  return optimized;
}

function buildDescription(profile: ProfileData | null) {
  const custom = profile?.seo?.description?.trim();
  if (
    custom &&
    custom.toLowerCase().startsWith("ashutosh choudhary portfolio") &&
    custom.length <= 160
  ) {
    return custom;
  }

  return DEFAULT_SEO.description;
}

function resolveImageUrl(profile: ProfileData | null) {
  const ogImage =
    profile?.seo?.ogImage?.secureUrl ||
    profile?.logo?.secureUrl ||
    "/main-logo2.png";

  if (ogImage.startsWith("http")) return ogImage;
  return `${getSiteUrl()}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;
}

function buildKeywords(profile: ProfileData | null) {
  const merged = [...DEFAULT_SEO.keywords];
  const extra = [profile?.heroSubtitle, profile?.aboutText]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  ["typescript", "saas", "crm", "hrm"].forEach((keyword) => {
    if (extra.includes(keyword) && !merged.some((item) => item.toLowerCase() === keyword)) {
      merged.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  });

  return merged;
}

export function buildPortfolioMetadata(profile: ProfileData | null): Metadata {
  const siteUrl = getSiteUrl();
  const name = personName(profile);
  const title = buildTitle(profile);
  const description = buildDescription(profile);
  const canonical = profile?.seo?.canonicalUrl || siteUrl;
  const imageUrl = resolveImageUrl(profile);
  const keywords = buildKeywords(profile);
  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

  return {
    title: { absolute: title },
    description,
    keywords,
    applicationName: `${name} Portfolio`,
    authors: [{ name, url: canonical }],
    creator: name,
    publisher: name,
    category: "technology",
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonical,
      siteName: `${name} Portfolio`,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${name} portfolio`,
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
    verification: googleVerification ? { google: googleVerification } : undefined,
    other: profile?.contactEmail
      ? {
          "contact:email": profile.contactEmail,
        }
      : undefined,
  };
}

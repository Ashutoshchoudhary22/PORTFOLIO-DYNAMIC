import type { ProfileData, ProjectItem, ServiceItem } from "@/lib/types";
import { getSiteUrl } from "@/lib/site-config";

type JsonLdProps = {
  profile: ProfileData | null;
  projects?: ProjectItem[];
  services?: ServiceItem[];
};

function absoluteUrl(path: string) {
  const siteUrl = getSiteUrl();
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function JsonLd({ profile, projects = [], services = [] }: JsonLdProps) {
  const siteUrl = getSiteUrl();
  const name = profile?.name || "Ashutosh Choudhary";
  const description =
    profile?.seo?.description ||
    profile?.heroSubtitle ||
    profile?.aboutText ||
    "Full Stack Developer portfolio";
  const image =
    profile?.seo?.ogImage?.secureUrl ||
    profile?.logo?.secureUrl ||
    absoluteUrl("/main-logo2.png");
  const sameAs = (profile?.socialLinks || [])
    .map((link) => link.url)
    .filter(Boolean);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: profile?.seo?.canonicalUrl || siteUrl,
    image: image.startsWith("http") ? image : absoluteUrl(image),
    email: profile?.contactEmail,
    jobTitle: "Full Stack Developer",
    description,
    sameAs,
    knowsAbout: [
      "React",
      "Node.js",
      "MongoDB",
      "TypeScript",
      "MERN Stack",
      "SaaS",
      "CRM",
      "HRM",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile?.seo?.title || `${name} Portfolio`,
    url: siteUrl,
    description,
    inLanguage: "en-IN",
    publisher: {
      "@type": "Person",
      name,
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: profile?.seo?.title || `${name} Portfolio`,
    url: siteUrl,
    description,
    mainEntity: {
      "@type": "Person",
      name,
    },
  };

  const serviceListSchema =
    services.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Professional Services",
          itemListElement: services.slice(0, 10).map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: service.title,
              description: service.description,
              provider: {
                "@type": "Person",
                name,
              },
            },
          })),
        }
      : null;

  const projectListSchema =
    projects.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Portfolio Projects",
          itemListElement: projects.slice(0, 12).map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "CreativeWork",
              name: project.title,
              description: project.description,
              url: project.liveUrl || project.githubUrl || siteUrl,
            },
          })),
        }
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${siteUrl}/#about`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Projects",
        item: `${siteUrl}/#projects`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Contact",
        item: `${siteUrl}/#contact`,
      },
    ],
  };

  const schemas: Record<string, unknown>[] = [
    personSchema,
    websiteSchema,
    profilePageSchema,
    breadcrumbSchema,
  ];

  if (serviceListSchema) schemas.push(serviceListSchema);
  if (projectListSchema) schemas.push(projectListSchema);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`${String(schema["@type"])}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

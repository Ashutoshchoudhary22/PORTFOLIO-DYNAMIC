import type { ProfileData, ProjectItem, ServiceItem } from "@/lib/types";
import { DEFAULT_SEO, getSiteUrl } from "@/lib/site-config";

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
  const storedDescription = profile?.seo?.description?.trim() || "";
  const description = storedDescription.toLowerCase().startsWith("ashutosh choudhary portfolio")
    ? storedDescription
    : DEFAULT_SEO.description;
  const image =
    profile?.seo?.ogImage?.secureUrl ||
    profile?.logo?.secureUrl ||
    absoluteUrl("/main-logo2.png");
  const sameAs = (profile?.socialLinks || [])
    .map((link) => link.url)
    .filter(Boolean);

  const pageUrl = profile?.seo?.canonicalUrl || siteUrl;
  const portfolioName = `${name} Portfolio`;
  const personId = `${siteUrl}/#person`;
  const websiteId = `${siteUrl}/#website`;
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  const personSchema = {
    "@type": "Person",
    "@id": personId,
    name,
    alternateName: ["AshutoshChoudhary", "ashutoshchoudhary"],
    url: pageUrl,
    image: imageUrl,
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
    "@type": "WebSite",
    "@id": websiteId,
    name: portfolioName,
    alternateName: [
      "Ashutosh Choudhary portfolio",
      "ashutoshchoudhary portfolio",
    ],
    url: siteUrl,
    description,
    inLanguage: "en-IN",
    publisher: { "@id": personId },
  };

  const profilePageSchema = {
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profile`,
    name: portfolioName,
    url: pageUrl,
    description,
    isPartOf: { "@id": websiteId },
    mainEntity: { "@id": personId },
    about: { "@id": personId },
  };

  const serviceListSchema =
    services.length > 0
      ? {
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": schemas,
        }),
      }}
    />
  );
}

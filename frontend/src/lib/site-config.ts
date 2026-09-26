export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  return url.replace(/\/$/, "");
}

export const DEFAULT_SEO = {
  title: "Ashutosh Choudhary | Full Stack MERN Developer Portfolio",
  description:
    "Portfolio of Ashutosh Choudhary, a Full Stack Developer specializing in MERN, SaaS, HRM, CRM, and enterprise dashboards.",
  keywords: [
    "Ashutosh Choudhary",
    "Full Stack Developer",
    "MERN Developer",
    "React Developer",
    "Node.js Developer",
    "Portfolio",
    "Web Developer India",
    "SaaS Developer",
    "CRM Developer",
    "HRM Systems",
  ],
};

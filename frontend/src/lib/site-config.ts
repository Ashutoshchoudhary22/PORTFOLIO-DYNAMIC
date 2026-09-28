export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  return url.replace(/\/$/, "");
}

export const BRAND_NAME = "Ashutosh Choudhary";

export const DEFAULT_SEO = {
  title: "Ashutosh Choudhary Portfolio | Full Stack Developer",
  description:
    "Ashutosh Choudhary portfolio (ashutoshchoudhary). Full Stack MERN developer building SaaS, HRM, CRM, and enterprise dashboards.",
  keywords: [
    "Ashutosh Choudhary portfolio",
    "Ashutosh Choudhary",
    "AshutoshChoudhary",
    "ashutoshchoudhary portfolio",
    "Ashutosh Choudhary developer",
    "Full Stack Developer",
    "MERN Developer",
    "React Developer",
    "Node.js Developer",
    "Web Developer India",
  ],
};

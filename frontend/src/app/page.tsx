import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PageLoadingAnimation } from "@/components/loading";
import { PortfolioProvider, PortfolioStatusBanner } from "@/components/portfolio-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionSkeleton } from "@/components/section-skeleton";
import { buildPortfolioMetadata } from "@/lib/seo-metadata";
import { fetchSeoBundle } from "@/lib/seo-server";

const About = dynamic(() => import("@/components/about").then((mod) => ({ default: mod.About })), {
  loading: () => <SectionSkeleton rows={2} />,
});

const Services = dynamic(
  () => import("@/components/service").then((mod) => ({ default: mod.Services })),
  { loading: () => <SectionSkeleton rows={3} /> }
);

const Projects = dynamic(
  () => import("@/components/project").then((mod) => ({ default: mod.Projects })),
  { loading: () => <SectionSkeleton rows={3} /> }
);

const Contact = dynamic(
  () => import("@/components/contact").then((mod) => ({ default: mod.Contact })),
  { loading: () => <SectionSkeleton rows={2} /> }
);

const Footer = dynamic(
  () => import("@/components/footer").then((mod) => ({ default: mod.Footer })),
  { loading: () => <SectionSkeleton rows={1} /> }
);

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await fetchSeoBundle();
  return buildPortfolioMetadata(profile);
}

export default async function Home() {
  const { profile, projects, services } = await fetchSeoBundle();

  return (
    <>
      <JsonLd profile={profile} projects={projects} services={services} />
      <PortfolioProvider>
        <PortfolioStatusBanner />
        <div className="flex flex-col min-h-screen bg-[#070b14]">
          <PageLoadingAnimation />
          <div className="relative">
            <Hero />
            <Header />
          </div>
          <main id="main-content">
            <About />
            <Services />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
      </PortfolioProvider>
    </>
  );
}

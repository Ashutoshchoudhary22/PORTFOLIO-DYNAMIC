import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PageLoadingAnimation } from "@/components/loading";
import { PortfolioProvider, PortfolioStatusBanner } from "@/components/portfolio-provider";
import { SectionSkeleton } from "@/components/section-skeleton";

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

export default function Home() {
  return (
    <PortfolioProvider>
      <PortfolioStatusBanner />
      <div className="flex flex-col min-h-screen">
        <PageLoadingAnimation />
        <Header />
        <Hero />
        <About />
        <Services />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </PortfolioProvider>
  );
}

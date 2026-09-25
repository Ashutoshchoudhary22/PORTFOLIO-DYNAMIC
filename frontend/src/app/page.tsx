import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/service";
import { Projects } from "@/components/project";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { PageLoadingAnimation } from "@/components/loading";
import { PortfolioProvider, PortfolioStatusBanner } from "@/components/portfolio-provider";

export default function Home() {
  return (
    <PortfolioProvider>
      <PortfolioStatusBanner />
      <div className="flex flex-col min-h-screen ">
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

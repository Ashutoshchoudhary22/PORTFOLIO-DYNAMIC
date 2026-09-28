"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, CloudCog } from "lucide-react";
import { SectionBackground } from "@/components/section-background";
import Image from "next/image";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { getMediaUrl } from "@/lib/api";
import { SectionSkeleton } from "@/components/section-skeleton";
import { TiltCard } from "@/components/tilt-card";
import type { ServiceItem } from "@/lib/types";

const iconMap = {
  code: Code,
  database: Database,
  cloud: CloudCog,
  custom: Code,
};

function ServiceIcon({ service }: { service: ServiceItem }) {
  const Icon = iconMap[service.iconType as keyof typeof iconMap] || Code;
  return <Icon className="h-10 w-10 text-white" />;
}

export function Services() {
  const { profile, services, loading } = usePortfolioContext();

  if (loading) {
    return <SectionSkeleton rows={3} />;
  }

  return (
    <section id="services" className="portfolio-section relative overflow-hidden py-14 sm:py-20 lg:py-28 xl:py-32">
      <div className="absolute inset-0 z-0">
        <SectionBackground
          sectionVideos={profile?.sectionVideos}
          section="services"
          className="w-full h-full object-cover"
          preload="none"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="site-shell relative z-10">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mx-auto max-w-3xl text-balance text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] sm:text-4xl md:text-5xl lg:text-6xl">
            My Services
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-8 [perspective:1200px]">
          {services.map((service) => (
            <TiltCard key={service._id || service.title}>
            <Card
              className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:border-blue-400/70 hover:bg-white/10 sm:p-6"
            >
              <div className="relative mb-4 h-36 w-full overflow-hidden rounded-lg sm:h-40">
                <Image
                  src={getMediaUrl(service.image, "/services/web-design2.jpeg")}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <CardHeader className="p-0 flex justify-center mb-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/10">
                  <ServiceIcon service={service} />
                </div>
              </CardHeader>
              <CardTitle className="mb-2 text-xl sm:text-2xl">{service.title}</CardTitle>
              <CardContent className="p-0">
                <p className="text-white/90 mb-4">{service.description}</p>
              </CardContent>
            </Card>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

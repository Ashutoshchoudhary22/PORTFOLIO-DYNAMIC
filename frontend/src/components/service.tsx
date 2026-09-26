"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, CloudCog } from "lucide-react";
import { SectionBackground } from "@/components/section-background";
import Image from "next/image";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { getMediaUrl } from "@/lib/api";
import { SectionSkeleton } from "@/components/section-skeleton";
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
    <section id="services" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <SectionBackground
          sectionVideos={profile?.sectionVideos}
          section="services"
          className="w-full h-full object-cover"
          preload="none"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="mx-auto max-w-[700px] text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] animate-pulse">
            My Services
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card
              key={service._id || service.title}
              className="group relative text-center p-6 text-white rounded-lg transition-all duration-300 bg-transparent border border-transparent hover:-translate-y-2 hover:shadow-2xl hover:border-blue-400/70 hover:bg-white/5"
            >
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
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
              <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
              <CardContent className="p-0">
                <p className="text-white/90 mb-4">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

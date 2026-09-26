"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ArrowUpRight, Download, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { getMediaUrl, getSectionMedia } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { SectionVideo } from "@/lib/types";

const navLinks = [
  { href: "#hero", label: "Home", id: "hero" },
  { href: "#about", label: "About", id: "about" },
  { href: "#services", label: "Services", id: "services" },
  { href: "#projects", label: "Projects", id: "projects" },
  { href: "#contact", label: "Contact", id: "contact" },
];

function MobileMenuBackground({
  sectionVideos,
  isOpen,
}: {
  sectionVideos?: SectionVideo[];
  isOpen: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const headerMedia = getSectionMedia(sectionVideos, "header", "");
  const heroMedia = getSectionMedia(sectionVideos, "hero", "/hero-1.mp4");
  const media = headerMedia.secureUrl ? headerMedia : heroMedia;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpen || media.type !== "video" || !media.secureUrl) return;

    video.load();
    void video.play().catch(() => undefined);

    return () => {
      video.pause();
    };
  }, [isOpen, media.secureUrl, media.type]);

  if (!isOpen || !media.secureUrl) {
    return <div className="absolute inset-0 bg-[#070b14]" aria-hidden="true" />;
  }

  if (media.type === "image") {
    return (
      <>
        <Image
          src={media.secureUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized={
            media.secureUrl.startsWith("/") || media.secureUrl.includes("cloudinary.com")
          }
        />
        <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80"
          aria-hidden="true"
        />
      </>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        src={media.secureUrl}
        poster={media.thumbnailUrl}
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75"
        aria-hidden="true"
      />
    </>
  );
}

export function Header() {
  const { profile, loading } = usePortfolioContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const logoUrl = getMediaUrl(profile?.logo, "/main-logo2.png");
  const resumeUrl = getMediaUrl(profile?.resume, "/Ashutosh.Choudhary.Resume.pdf");
  const displayName = profile?.name?.split(" ")[0] || "Portfolio";

  useEffect(() => {
    let ticking = false;

    const updateOnScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const scrollMarker = window.scrollY + window.innerHeight * 0.35;
      let current = navLinks[0].id;

      for (let i = navLinks.length - 1; i >= 0; i -= 1) {
        const section = document.getElementById(navLinks[i].id);
        if (section && section.offsetTop <= scrollMarker) {
          current = navLinks[i].id;
          break;
        }
      }

      setActiveSection(current);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        updateOnScroll();
        ticking = false;
      });
    };

    const retryTimer = window.setTimeout(updateOnScroll, 300);

    updateOnScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateOnScroll);

    return () => {
      window.clearTimeout(retryTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateOnScroll);
    };
  }, [loading]);

  function handleLinkClick() {
    setIsSheetOpen(false);
  }

  function scrollToSection(id: string) {
    const section = document.getElementById(id);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveSection(id);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full px-3 sm:px-4 pt-3 sm:pt-4 pointer-events-none bg-transparent">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border px-3 sm:px-4 transition-all duration-500",
          isScrolled
            ? "h-14 bg-black/60 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "h-16 bg-black/35 backdrop-blur-xl border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
        )}
      >
        <Link
          href="#hero"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("hero");
          }}
          className="group flex items-center gap-2.5 shrink-0 rounded-xl py-1 pr-2"
        >
          <span className="relative">
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 to-violet-500/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src={logoUrl}
              alt={`${profile?.name || "Portfolio"} logo`}
              width={40}
              height={40}
              className="relative rounded-full ring-2 ring-white/15 group-hover:ring-white/30 transition-all"
              priority
            />
          </span>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-white">{displayName}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">Developer</p>
          </div>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex flex-1 items-center justify-center"
        >
          <div className="flex items-center gap-1 rounded-full bg-white/[0.05] border border-white/[0.08] p-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-300",
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-500/30 to-violet-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                      : "text-white/65 hover:text-white hover:bg-white/[0.08]"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <a
            href={resumeUrl}
            download="Ashutosh_Choudhary_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="Download Resume"
            aria-label="Download Resume"
            className="hidden lg:inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.05] transition-all"
          >
            <Download className="h-4 w-4" />
          </a>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl h-10 w-10 text-white hover:bg-white/10 hover:text-white border border-white/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-none border-none p-0 overflow-hidden bg-[#070b14] text-white [&>button]:z-30 [&>button]:text-white [&>button]:hover:bg-white/10 [&>button]:rounded-full [&>button]:top-5 [&>button]:right-5"
            >
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>

              <div className="relative h-full min-h-screen flex flex-col">
                <div className="absolute inset-0 z-0">
                  <MobileMenuBackground
                    sectionVideos={profile?.sectionVideos}
                    isOpen={isSheetOpen}
                  />
                </div>

                <div className="relative z-10 flex flex-col h-full min-h-screen px-6 pt-8 pb-10">
                  <div className="flex items-center gap-3 pb-6 mb-2 border-b border-white/15">
                    <Image
                      src={logoUrl}
                      alt={`${profile?.name || "Portfolio"} logo`}
                      width={44}
                      height={44}
                      className="rounded-full ring-2 ring-white/20 shadow-lg"
                    />
                    <div>
                      <p className="font-semibold text-lg">{profile?.name || "Portfolio"}</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                        Full Stack Developer
                      </p>
                    </div>
                  </div>

                  <nav className="flex-1 grid gap-2 content-start">
                    {navLinks.map((link, index) => {
                      const isActive = activeSection === link.id;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={handleLinkClick}
                          style={{ animationDelay: `${index * 60}ms` }}
                          className={cn(
                            "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-all animate-in fade-in slide-in-from-right-4 duration-300 fill-mode-both",
                            isActive
                              ? "bg-white/15 border border-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                              : "bg-white/[0.06] border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <span>{link.label}</span>
                          {isActive ? (
                            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 opacity-40" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  <a
                    href={resumeUrl}
                    download="Ashutosh_Choudhary_Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30"
                  >
                    <Download className="h-4 w-4" />
                    Download Resume
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

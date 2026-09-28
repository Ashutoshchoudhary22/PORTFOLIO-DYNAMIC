"use client";

import Link from "next/link";
import { ArrowDown, Download } from "lucide-react";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SectionBackground } from "@/components/section-background";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { getResumeDownloadUrl } from "@/lib/api";
import { SectionSkeleton } from "@/components/section-skeleton";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export function Hero() {
  const { profile, loading } = usePortfolioContext();
  const stageRef = React.useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <section id="hero" className="relative min-h-screen bg-[#070b14] pt-24">
        <SectionSkeleton rows={1} />
      </section>
    );
  }

  const resumeUrl = getResumeDownloadUrl(profile?.resume);

  function tiltStage(event: React.PointerEvent<HTMLElement>) {
    const el = stageRef.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 8;
    el.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  }

  function resetStage() {
    if (stageRef.current) {
      stageRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  }

  return (
    <section
      id="hero"
      className="portfolio-section hero-stage relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-clip py-8 text-center scroll-mt-0 sm:py-12"
      onPointerMove={tiltStage}
      onPointerLeave={resetStage}
    >
      <div className="absolute inset-0 z-0 bg-[#070b14]">
        <SectionBackground
          sectionVideos={profile?.sectionVideos}
          section="hero"
          fallback="/hero-1.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          preload="auto"
        />
        <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      </div>
      <div className="hero-ring hero-ring-2" aria-hidden="true" />
      <div className="hero-ring hero-ring-1" aria-hidden="true" />
      <div
        ref={stageRef}
        className="hero-stage-inner hero-glass relative z-20 mx-4 mt-24 w-full max-w-4xl space-y-5 rounded-3xl px-4 py-8 sm:mx-6 sm:space-y-6 sm:px-8 sm:py-10 lg:mt-28"
      >
        <h1 className="mx-auto max-w-3xl text-balance text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          {`${profile?.name || "Ashutosh Choudhary"} Portfolio`}
        </h1>
        <p className="mx-auto max-w-3xl text-balance text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-blue-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] sm:text-base md:text-lg lg:text-xl">
          {profile?.heroSubtitle ||
            "Full Stack Developer with 1.5+ years of experience building production-grade MERN SaaS platforms, HRM systems, CRM solutions, and enterprise dashboards."}
        </p>

        <div className="mx-auto flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            asChild
            size="lg"
            className="w-full border-0 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/35 hover:from-blue-600 hover:via-violet-600 hover:to-fuchsia-600 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all sm:w-auto"
          >
            <Link href="#projects">View My Work</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full border-2 border-white/40 bg-white/15 backdrop-blur-md text-white font-semibold shadow-lg shadow-black/20 hover:bg-white/25 hover:border-white/60 transition-all sm:w-auto"
          >
            <Link href="#contact">Get in Touch</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="w-full border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/35 hover:from-emerald-600 hover:to-teal-600 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all sm:w-auto"
          >
            <a
              href={resumeUrl}
              rel="noopener noreferrer"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </a>
          </Button>
        </div>
        <div className="flex justify-center pt-2 sm:pt-4">
          <Link href="#projects" aria-label="Scroll to projects">
            <ArrowDown className="h-6 w-6 text-white/70 animate-bounce" />
          </Link>
        </div>
      </div>
    </section>
  );
}

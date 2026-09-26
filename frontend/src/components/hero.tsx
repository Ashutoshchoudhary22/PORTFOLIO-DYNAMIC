"use client";

import Link from "next/link";
import { ArrowDown, Download } from "lucide-react";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SectionBackground } from "@/components/section-background";
import { usePortfolioContext } from "@/components/portfolio-provider";
import { getMediaUrl } from "@/lib/api";
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

  if (loading) {
    return <SectionSkeleton rows={1} />;
  }

  const resumeUrl = getMediaUrl(profile?.resume, "/Ashutosh.Choudhary.Resume.pdf");

  return (
    <section
      id="hero"
      className="portfolio-section relative flex w-full flex-col items-center justify-center overflow-hidden py-12 text-center min-h-[calc(100vh-56px)]"
    >
      <div className="absolute inset-0 z-0 bg-blue-300/50">
        <SectionBackground
          sectionVideos={profile?.sectionVideos}
          section="hero"
          className="w-full h-full object-cover"
          preload="none"
        />
      </div>
      <div className="relative z-20 space-y-6 p-8 rounded-lg">
        <h1 className="mx-auto max-w-[700px] text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          {profile?.seo?.title || profile?.heroHeading || "Hi, I'm Ashutosh Choudhary"}
        </h1>
        <p className="mx-auto max-w-[700px] md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-500 to-blue-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
          {profile?.seo?.description ||
            profile?.heroSubtitle ||
            "Full Stack Developer with 1.5+ years of experience building production-grade MERN SaaS platforms, HRM systems, CRM solutions, and enterprise dashboards."}
        </p>

        <div className="space-x-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-600 hover:to-pink-600"
          >
            <Link href="#projects">View My Work</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-transparent  bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 hover:text-transparent"
          >
            <Link href="#contact">Get in Touch</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white animate-pulse shadow-[0_4px_8px_rgba(0,0,0,0.5)] hover:bg-gradient-to-r hover:from-green-500 hover:via-emerald-600 hover:to-teal-600"
          >
            <a
              href={resumeUrl}
              download="Ashutosh_Choudhary_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </a>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 z-20">
        <Link href="#projects" aria-label="Scroll to projects">
          <ArrowDown className="h-6 w-6 text-muted-foreground animate-bounce" />
        </Link>
      </div>
    </section>
  );
}

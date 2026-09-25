"use client";

import { useState, useEffect } from "react";
import { useLoading } from "@/hooks/use-loading";

const loadingSteps = [
  "Initializing portfolio",
  "Loading projects and experience",
  "Preparing interface",
  "Almost ready",
];

export function LoadingAnimation() {
  const { isLoading, progress } = useLoading(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-live="polite"
      aria-busy={isLoading}
    >
      <div className="absolute inset-0 bg-[#070b14]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-8 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400/90 border-r-violet-400/70 animate-spin" />
              <div className="absolute inset-3 rounded-full border border-white/5" />
              <div className="h-2.5 w-2.5 rounded-full bg-blue-400/80 shadow-[0_0_18px_rgba(96,165,250,0.8)]" />
            </div>

            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-blue-300/70">
              Portfolio
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Loading Experience
            </h3>
            <p
              key={stepIndex}
              className="mt-3 min-h-6 text-sm text-white/55 animate-loading-step"
            >
              {loadingSteps[stepIndex]}
            </p>

            <div className="mt-8 w-full space-y-3">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-400 transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-white/45">
                <span>Please wait</span>
                <span className="tabular-nums font-medium text-white/70">
                  {Math.round(Math.min(progress, 100))}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageLoadingAnimation() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden bg-white/5">
      <div className="h-full w-1/3 animate-loading-bar bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
    </div>
  );
}

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-white/10 border-t-blue-400`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function SectionLoading({
  children,
  isLoading,
  className = "",
}: {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
}) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-white/50">Loading content...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { useLoading } from "@/hooks/use-loading";

export function LoadingAnimation() {
  const { isLoading, progress } = useLoading(true);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Crafting Digital Magic...",
    "Loading Awesome Content...",
    "Almost There...",
    "Preparing Experience...",
    "Setting Up Portfolio...",
  ];

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: (i * 17 + 13) % 100,
        top: (i * 23 + 7) % 100,
        size: (i % 5) + 2,
        hue: (i * 12) % 60 + 200,
        delay: (i % 10) * 0.3,
        duration: (i % 4) + 2,
      })),
    []
  );

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 800);
    return () => clearInterval(interval);
  }, [isLoading, loadingTexts.length]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-md">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `hsl(${particle.hue}, 70%, 60%)`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-10 animate-fade-in-up">
        {/* Enhanced 3D Spinner */}
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-2xl animate-pulse-glow"></div>
          
          {/* Main Spinner Layers */}
          <div className="relative w-32 h-32">
            {/* Layer 1 - Fast */}
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin-fast"></div>
            {/* Layer 2 - Medium */}
            <div className="absolute inset-2 border-4 border-transparent border-b-pink-500 border-l-green-500 rounded-full animate-spin animation-delay-150"></div>
            {/* Layer 3 - Slow */}
            <div className="absolute inset-4 border-3 border-transparent border-t-cyan-400 border-r-yellow-400 rounded-full animate-spin-slow animation-delay-300"></div>
            {/* Center Glow */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-30 animate-pulse"></div>
          </div>
        </div>
        
        {/* Animated Loading Text with Typing Effect */}
        <div className="text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-blue-400 bg-[length:200%_auto] animate-gradient-shift">
            Loading Portfolio
          </h3>
          <div className="h-8">
            <p className="text-gray-300 text-lg md:text-xl font-semibold animate-text-slide">
              {loadingTexts[currentText]}
            </p>
          </div>
        </div>

        {/* Enhanced Progress Bar with Glow */}
        <div className="w-full max-w-md space-y-3">
          <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-2xl border border-gray-700">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-shimmer"></div>
            <div 
              className="relative h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
            </div>
          </div>
          
          {/* Progress Percentage with Animation */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <div className="text-gray-300 text-sm font-bold tabular-nums">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Floating Tech Icons */}
        <div className="flex space-x-6 mt-4">
          {['⚡', '🚀', '💻', '✨'].map((icon, i) => (
            <div
              key={i}
              className="text-3xl animate-float-icon"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Page Loading Animation for route changes
export function PageLoadingAnimation() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Listen for route changes
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
  );
}

// Simple Spinner Component
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-transparent border-t-blue-500 rounded-full animate-spin`}></div>
  );
}

// Section Loading Component
export function SectionLoading({ children, isLoading, className = "" }: { 
  children: React.ReactNode; 
  isLoading: boolean; 
  className?: string;
}) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-pink-500 border-l-green-500 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

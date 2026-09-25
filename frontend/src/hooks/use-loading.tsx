"use client";

import { useState, useEffect } from "react";

export function useLoading(initialState = true) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setProgress(100);
  };

  return {
    isLoading,
    progress,
    startLoading,
    stopLoading,
    setProgress
  };
}


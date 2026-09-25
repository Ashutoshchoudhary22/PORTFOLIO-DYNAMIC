"use client";

import { useState, useEffect } from "react";

export function useLoading(initialState = true) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    let current = 0;
    const progressInterval = setInterval(() => {
      if (current >= 100) {
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => setIsLoading(false), 350);
        return;
      }

      const increment =
        current < 60 ? 4 + Math.random() * 6 : current < 90 ? 2 + Math.random() * 3 : 1;

      current = Math.min(current + increment, 100);
      setProgress(current);
    }, 120);

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
    setProgress,
  };
}

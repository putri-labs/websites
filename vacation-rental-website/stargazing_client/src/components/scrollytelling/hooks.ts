"use client";

import { useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useScrollProgress } from "./context";

/**
 * Normalizes scroll progress [0, 1] within a specific window [start, end].
 * Returns the mapped progress and an 'active' boolean for CSS transitions.
 */
export function useScrollWindow(start: number, end: number) {
  const progress = useScrollProgress();
  const [active, setActive] = useState(false);

  // Map the global progress to a 0-1 range within the window
  const windowProgress = useTransform(progress, [start, end], [0, 1], {
    clamp: true
  });

  useEffect(() => {
    return progress.on("change", (v) => {
      const isActive = v >= start && v <= end;
      if (isActive !== active) {
        setActive(isActive);
      }
    });
  }, [progress, start, end, active]);

  return {
    active,
    progress: windowProgress
  };
}

/**
 * Maps scroll progress from [start, end] to a custom numeric range [from, to].
 * Supports easing functions.
 */
export function useScrollMap(
  start: number, 
  end: number, 
  from: number, 
  to: number, 
  easing: "linear" | "easeIn" | "easeOut" | "easeInOut" = "linear"
) {
  const progress = useScrollProgress();
  
  const easingMap = {
    linear: (v: number) => v,
    easeIn: (v: number) => v * v,
    easeOut: (v: number) => 1 - Math.pow(1 - v, 2),
    easeInOut: (v: number) => v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2
  };

  return useTransform(
    progress, 
    [start, end], 
    [from, to], 
    { 
      clamp: true,
      ease: easingMap[easing]
    }
  );
}

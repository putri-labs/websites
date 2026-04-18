"use client";

import { useContext, useState, useEffect } from "react";
import { useTransform } from "framer-motion";
import { ScrollTellingContext } from "./context";

/**
 * A "safe" version of scroll hooks that won't throw if context is missing.
 * Useful for components that might be used both inside and outside scrollytelling.
 */
export function useScrollTellingHooks(start: number, end: number) {
  const context = useContext(ScrollTellingContext);
  const [active, setActive] = useState(false);

  // If no context, we return a mock state that is always "active" (or handled by caller)
  if (!context) {
    return { active: true, progress: null };
  }

  // Map the global progress to a 0-1 range within the window
  const windowProgress = useTransform(context, [start, end], [0, 1], {
    clamp: true
  });

  // Track active state with stable effect
  useEffect(() => {
    return context.on("change", (v) => {
      const isActive = v >= start && v <= end;
      if (isActive !== active) {
        setActive(isActive);
      }
    });
  }, [context, start, end, active]);

  return {
    active,
    progress: windowProgress
  };
}



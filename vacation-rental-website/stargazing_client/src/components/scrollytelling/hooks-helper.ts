"use client";

import { useContext, useState, useEffect } from "react";
import { useTransform, useMotionValue } from "framer-motion";
import { ScrollTellingContext } from "./context";

/**
 * A "safe" version of scroll hooks that won't throw if context is missing.
 * Useful for components that might be used both inside and outside scrollytelling.
 */
export function useScrollTellingHooks(start: number, end: number) {
  const context = useContext(ScrollTellingContext);
  const fallbackContext = useMotionValue(0);
  const actualContext = context || fallbackContext;
  
  const [active, setActive] = useState(!context);

  // Map the global progress to a 0-1 range within the window
  const windowProgress = useTransform(actualContext, [start, end], [0, 1], {
    clamp: true
  });

  // Track active state with stable effect
  useEffect(() => {
    if (!context) return;
    return actualContext.on("change", (v) => {
      const isActive = v >= start && v <= end;
      if (isActive !== active) {
        setActive(isActive);
      }
    });
  }, [actualContext, start, end, active, context]);

  return {
    active: context ? active : true,
    progress: windowProgress
  };
}



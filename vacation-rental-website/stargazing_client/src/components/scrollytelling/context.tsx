"use client";

import { createContext, useContext } from "react";
import { MotionValue } from "framer-motion";

export const ScrollTellingContext = createContext<MotionValue<number> | null>(null);

export function useScrollProgress() {
  const context = useContext(ScrollTellingContext);
  if (!context) {
    throw new Error("useScrollProgress must be used inside a <ScrollTelling> component.");
  }
  return context;
}

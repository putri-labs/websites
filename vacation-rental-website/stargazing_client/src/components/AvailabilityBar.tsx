"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AvailabilityBarProps {
  ctaText?: string;
}

export default function AvailabilityBar({
  ctaText = "Check Availability",
}: AvailabilityBarProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto mt-20"
    >
      <div className="relative group">
        {/* Architectural Hairline Frame */}
        <div className="absolute -inset-4 border border-white/30 scale-95 group-hover:scale-100 transition-transform duration-1000 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-4 items-stretch hairline-border bg-neutral-900/40">
          <motion.div
            variants={item}
            className="flex flex-col p-6 border-b md:border-b-0 md:border-r border-white/10 group/item hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/100 mb-3">
              01 // Arrival
            </span>
            <span className="text-sm font-light text-white group-hover/item:text-white transition-colors">
              Select Date
            </span>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-col p-6 border-b md:border-b-0 md:border-r border-white/10 group/item hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/100 mb-3">
              02 // Departure
            </span>
            <span className="text-sm font-light text-white group-hover/item:text-white transition-colors">
              Select Date
            </span>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-col p-6 border-b md:border-b-0 md:border-r border-white/10 group/item hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent/100 mb-3">
              03 // Guests
            </span>
            <span className="text-sm font-light text-white group-hover/item:text-white transition-colors">
              Add Guests
            </span>
          </motion.div>

          <motion.button
            variants={item}
            className="flex items-center justify-center p-6 bg-accent text-background hover:bg-white transition-all duration-500 overflow-hidden relative group/btn"
          >
            <span className="relative z-10 text-[10px] font-mono uppercase tracking-[0.4em] font-bold">
              {ctaText}
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

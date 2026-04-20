"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollTellingHooks } from "./scrollytelling/hooks-helper";

interface MagazineSectionProps {
  headline: string;
  subheadline?: string;
  copy?: string[];
  className?: string;
  start?: number;
  end?: number;
}

export default function MagazineSection({
  headline,
  subheadline,
  copy = [],
  className,
  start = 0,
  end = 1,
}: MagazineSectionProps) {
  const { active } = useScrollTellingHooks(start, end);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div
      className={cn(
        "absolute inset-0 w-full flex flex-col items-center justify-center overflow-hidden",
        active ? "pointer-events-auto" : "pointer-events-none",
        className,
      )}
    >
      {/* Background Scrim for readability with subtle blur */}
      <div 
        className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70vh] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,transparent_80%)] backdrop-blur-[2px] pointer-events-none z-0 transition-opacity duration-1000",
          active ? "opacity-100" : "opacity-0"
        )}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        className="relative z-10 max-w-4xl w-full px-8 md:px-12 lg:px-20 text-center"
      >
        {/* Headline Section */}
        <div className="mb-12 flex flex-col items-center">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.9] tracking-tight text-scrim"
          >
            {headline}
          </motion.h1>
          {subheadline && (
            <motion.p
              variants={itemVariants}
              className="mt-8 text-xl md:text-2xl text-[#e6b93d] font-serif italic max-w-2xl leading-relaxed text-scrim"
            >
              {subheadline}
            </motion.p>
          )}
        </div>

        {/* Centered Body Text */}
        <div className="flex flex-col items-center space-y-8">
          {copy.map((paragraph, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={cn(
                "text-lg md:text-xl text-white leading-relaxed font-normal font-serif max-w-2xl px-4 text-scrim",
                idx === 0 &&
                  "first-letter:text-6xl md:first-letter:text-7xl first-letter:font-bold first-letter:text-[#e6b93d] first-letter:mr-3 first-letter:leading-[0.8] first-letter:font-serif",
              )}
            >
              {paragraph}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

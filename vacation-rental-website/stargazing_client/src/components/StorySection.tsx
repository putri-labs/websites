"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollTellingHooks } from "./scrollytelling/hooks-helper";

interface StorySectionProps {
  headline?: string;
  subheadline?: string;
  className?: string;
  isHero?: boolean;
  start?: number;
  end?: number;
  icon?: any;
}

export default function StorySection({
  headline,
  subheadline,
  className,
  isHero,
  start = 0,
  end = 1,
  icon: Icon,
}: StorySectionProps) {
  const { active, progress } = useScrollTellingHooks(start, end);

  // Parallax / Entrance animations
  const y = progress ? (isHero ? 0 : 100) : 0;

  return (
    <div
      className={cn(
        "absolute inset-0 w-full flex flex-col items-center justify-center transition-all duration-700",
        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60vh] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.6)_0%,transparent_80%)] backdrop-blur-[2px] pointer-events-none z-0" />

      <div className="relative z-10 text-center flex flex-col items-center px-6">
        {Icon && (
          <div className="mb-8 flex justify-center">
            <div className="p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[#d4af37] shadow-xl">
              <Icon size={32} />
            </div>
          </div>
        )}
        {headline && (
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-4 md:mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {headline}
          </h1>
        )}
        {subheadline && (
          <p className="text-lg md:text-2xl text-white/80 max-w-2xl font-light drop-shadow-lg text-scrim">
            {subheadline}
          </p>
        )}
      </div>
    </div>
  );
}

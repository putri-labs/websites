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
  icon: Icon
}: StorySectionProps) {
  const { active, progress } = useScrollTellingHooks(start, end);

  // Parallax / Entrance animations
  const y = progress ? (isHero ? 0 : 100) : 0; 
  
  return (
    <div 
      className={cn(
        "absolute inset-0 w-full flex flex-col items-center justify-center transition-all duration-700",
        active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
    >
      <div className="text-center flex flex-col items-center px-6">
        {Icon && (
          <div className="mb-8 flex justify-center">
            <div className="p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[#d4af37]">
              <Icon size={32} />
            </div>
          </div>
        )}
        {headline && (
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white/90 mb-4 md:mb-6 drop-shadow-lg">
            {headline}
          </h1>
        )}
        {subheadline && (
          <p className="text-lg md:text-2xl text-white/70 max-w-2xl font-light drop-shadow">
            {subheadline}
          </p>
        )}

        {isHero && (
          <div className="mt-[20vh] flex flex-col items-center gap-4 animate-pulse">
            <p className="text-xs md:text-sm uppercase tracking-widest text-[#d4af37] font-medium">Scroll to Explore</p>
            <div className="w-[1px] h-16 md:h-24 bg-gradient-to-b from-[#d4af37] to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

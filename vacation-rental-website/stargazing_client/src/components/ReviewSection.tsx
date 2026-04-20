"use client";

import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollTellingHooks } from "./scrollytelling/hooks-helper";
import { Star } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface Review {
  quote: string;
  author: string;
  location: string;
}

const reviews: Review[] = [
  {
    quote: "The silence here is profound. Watching the Milky Way from the warmth of the cabin was a spiritual experience.",
    author: "Eleanor V.",
    location: "London, UK"
  },
  {
    quote: "Architectural perfection meets natural wonder. A truly transformative stay that reconnects you with the cosmos.",
    author: "Julian M.",
    location: "San Francisco, CA"
  },
  {
    quote: "Better than any five-star hotel. This is luxury defined by stillness and the vastness of the Sierras.",
    author: "Sarah L.",
    location: "New York, NY"
  },
  {
    quote: "An otherworldly retreat. Every detail, from the telescope to the heated deck, was flawlessly curated.",
    author: "Marcus D.",
    location: "Berlin, DE"
  }
];

interface ReviewSectionProps {
  headline?: string;
  start: number;
  end: number;
  className?: string;
}

export default function ReviewSection({
  headline = "What our guests have to say",
  start,
  end,
  className
}: ReviewSectionProps) {
  const { active, progress } = useScrollTellingHooks(start, end);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Motion values for horizontal movement
  const targetX = useMotionValue(0);
  const x = useSpring(targetX, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001
  });

  // Entrance/Exit opacity (mapped to scrollytelling progress)
  const mainOpacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If we are hovering the carousel area and the section is active
      if (isHovered && active) {
        // STOP propagation to Lenis/SmoothScroll before it reaches the window
        e.stopPropagation();
        
        // Prevent default vertical scroll ONLY if we are in the focus zone
        e.preventDefault();
        
        // Update horizontal position
        const currentX = targetX.get();
        const delta = e.deltaY * 0.8; // Sensitivity multiplier
        
        // Calculate boundaries (simple estimation based on content width)
        const contentWidth = reviews.length * 520; // card width + gap
        const viewportWidth = window.innerWidth;
        const minX = -(contentWidth - viewportWidth * 0.8);
        const maxX = 0;
        
        const nextX = Math.max(minX, Math.min(maxX, currentX - delta));
        targetX.set(nextX);
      }
    };

    // Attach listener with passive: false AND capture: true to intercept before global scroll listeners
    container.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => container.removeEventListener("wheel", handleWheel, { capture: true } as EventListenerOptions);
  }, [isHovered, active, targetX]);

  return (
    <div
      ref={containerRef}
      data-lenis-prevent
      className={cn(
        "absolute inset-0 w-full flex flex-col items-center justify-center overflow-hidden",
        active ? "pointer-events-auto" : "pointer-events-none",
        className
      )}
    >
      {/* Background Scrim & Blur for legibility - Matched to TripleColumnSection */}
      <div
        className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70vh] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.7)_0%,transparent_85%)] backdrop-blur-[3px] pointer-events-none z-0 transition-opacity duration-1000",
          active ? "opacity-100" : "opacity-0",
        )}
      />

      <motion.div
        style={{ opacity: mainOpacity }}
        className="relative z-10 w-full flex flex-col items-center"
      >
        {/* Headline - Matched to TripleColumnSection typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-[#e6b93d] mb-6 tracking-wide drop-shadow-xl">
            {headline}
          </h2>
          <div className="w-16 h-px bg-[#e6b93d]/30 mx-auto" />
        </motion.div>

        {/* Review Carousel Container */}
        <div 
          className="relative w-full overflow-visible px-[10%]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div 
            ref={carouselRef}
            style={{ x }}
            className="flex gap-8 md:gap-12 will-change-transform cursor-grab active:cursor-grabbing"
          >
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex-shrink-0 w-[80vw] md:w-[480px] bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl flex flex-col justify-between shadow-2xl transition-all duration-500",
                  "group hover:border-[#e6b93d]/30 hover:bg-black/60"
                )}
              >
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(230,185,61,0.05)_0%,transparent_70%)] pointer-events-none rounded-tr-2xl" />

                <div className="mb-10 relative">
                  <div className="flex gap-1 mb-8 opacity-60 group-hover:opacity-100 transition-opacity">
                    {[...Array(5)].map((_, i) => (
                       <Star key={i} size={12} className="fill-[#e6b93d] text-[#e6b93d]" />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl font-serif text-white/80 leading-relaxed italic tracking-wide">
                    &quot;{review.quote}&quot;
                  </p>
                </div>

                <div className="mt-auto border-t border-white/10 pt-8 flex items-center justify-between">
                  <div>
                    <p className="text-[#e6b93d] font-sans font-medium tracking-[0.2em] uppercase text-[10px]">
                      {review.author}
                    </p>
                    <p className="text-white/40 font-sans text-[9px] uppercase tracking-widest mt-1">
                      {review.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

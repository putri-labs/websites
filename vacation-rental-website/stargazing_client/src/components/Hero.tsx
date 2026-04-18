"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useScrollTellingHooks } from "./scrollytelling/hooks-helper";
import { cn } from "@/lib/utils";
import AvailabilityBar from "./AvailabilityBar";
import { useRef } from "react";

export default function Hero() {
  const { active, progress } = useScrollTellingHooks(0, 0.1);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-all duration-1000 z-30 overflow-hidden",
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Texture Overlay */}
      <div className="grain-overlay" />

      {/* Dynamic Atmospheric Nebula */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/10 blur-[150px] pointer-events-none"
      />

      {/* Main Content: Editorial Layout */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-20"
      >
        <div className="flex flex-col items-start md:items-center">

          <div className="relative mb-4 md:mb-0">
            {/* The "Celestial" - Serif Primary */}
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="font-serif text-[15vw] md:text-[12vw] text-accent leading-[0.8] tracking-tighter"
            >
              Celestial
            </motion.h1>

            {/* The "Clarity" - Offset Sans-Serif Secondary */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="md:absolute md:top-1/2 md:right-[-5vw] md:-translate-y-1/2"
            >
              <span className="font-sans text-[8vw] md:text-[6vw] text-grey-900 font-extralight tracking-[0.4em] uppercase opacity-80 mix-blend-screen">
                Clarity
              </span>
            </motion.div>
          </div>

          {/* Subheading with Technical Detail */}
          <div className="mt-20 w-full flex flex-col md:flex-row items-end justify-between gap-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="max-w-md"
            >
              <p className="font-sans text-white text-sm md:text-lg leading-relaxed tracking-wider">
                When the sun dips below the horizon, the real performance begins.
                A private observatory for the soul, perched where time dissolves into the void.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1, duration: 1 }}
              className="hidden md:block text-[10px] font-mono text-white tracking-[0.5em] vertical-rl uppercase opacity-20"
            >
              Beyond the Horizon // 2026
            </motion.div>
          </div>

          <AvailabilityBar />

        </div>
      </motion.div>

      {/* Scroll Indicator: Minimalist Line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-accent to-transparent origin-bottom"
      />

    </section>
  );
}

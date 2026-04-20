"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useScrollTellingHooks } from "./scrollytelling/hooks-helper";
import AvailabilityBar from "./AvailabilityBar";
import { useRef } from "react";

export default function Hero() {
  const { active } = useScrollTellingHooks(0, 0.1);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Synchronize UI smoothing with the same momentum as the background
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const textY = useTransform(smoothProgress, [0, 1], [0, 150]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);

  return (
    <motion.section
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none"
      }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-30 overflow-hidden will-change-opacity"
    >
      {/* Texture Overlay */}
      <div className="grain-overlay" />

      {/* Dynamic Atmospheric Nebula */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-900/10 via-transparent to-purple-900/5 blur-[120px] pointer-events-none"
      />

      {/* Content Protection Scrim */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70vh] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.5)_0%,transparent_80%)] pointer-events-none z-0" />

      {/* Main Content: Editorial Layout */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-20 will-change-transform"
      >
        <div className="flex flex-col items-start md:items-center">
          <div className="relative mb-4 md:mb-0">
            {/* The "Celestial" - Serif Primary */}
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              className="font-serif text-[15vw] md:text-[12vw] text-accent leading-[0.8] tracking-tighter drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]"
            >
              Celestial
            </motion.h1>

            {/* The "Clarity" - Offset Sans-Serif Secondary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.4,
              }}
              className="md:absolute md:top-1/2 md:right-[-5vw] md:-translate-y-1/2"
            >
              <span className="font-sans text-[8vw] md:text-[6vw] text-grey-900 font-extralight tracking-[0.4em] uppercase opacity-80 mix-blend-screen drop-shadow-2xl">
                Clarity
              </span>
            </motion.div>
          </div>

          {/* Subheading with Technical Detail */}
          <div className="mt-20 w-full flex md:flex-row items-center justify-center gap-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="max-w-md text-center"
            >
              <p className="font-sans text-white text-sm md:text-lg leading-relaxed tracking-wider drop-shadow-xl text-scrim">
                When the sun dips below the horizon, the real performance
                begins. A private observatory for the soul, perched where time
                dissolves into the void.
              </p>
            </motion.div>
          </div>

          <AvailabilityBar />
        </div>
      </motion.div>

      {/* Scroll Indicator: Minimalist Line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        style={{ opacity }} // Fade indicator out with content
        transition={{ delay: 2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-accent to-transparent origin-bottom"
      />
    </motion.section>
  );
}


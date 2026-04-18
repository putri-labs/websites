"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      // potentially animate navbar background later
    }
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-8 left-0 right-0 mx-auto z-50 bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl",
        "flex items-center justify-between px-6 md:px-10 py-4 rounded-full",
        "w-[90%] max-w-5xl",
      )}
    >
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-accent transition-colors">
          Stargazing
          <span className="text-accent group-hover:text-white transition-colors">
            .
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a
          href="#"
          className="text-white/80 hover:text-white transition-colors"
        >
          Destinations
        </a>
        <a
          href="#"
          className="text-white/80 hover:text-white transition-colors"
        >
          Experiences
        </a>
        <a
          href="#"
          className="text-white/80 hover:text-white transition-colors"
        >
          Journal
        </a>
      </div>

      <div className="flex items-center gap-6">
        <button className="hidden md:block px-6 py-2.5 bg-white text-background rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
          Book Now
        </button>
        <button className="text-white p-2 md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.nav>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollTellingHooks } from "./scrollytelling/hooks-helper";

interface TripleColumnItem {
  title: string;
  content: string;
  link?: {
    text: string;
    url: string;
  };
}

interface TripleColumnSectionProps {
  items: TripleColumnItem[];
  className?: string;
  start?: number;
  end?: number;
}

export default function TripleColumnSection({
  items,
  className,
  start = 0,
  end = 1,
}: TripleColumnSectionProps) {
  const { active } = useScrollTellingHooks(start, end);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
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
      {/* Background Scrim & Blur for legibility */}
      <div
        className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70vh] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.7)_0%,transparent_85%)] backdrop-blur-[3px] pointer-events-none z-0 transition-opacity duration-1000",
          active ? "opacity-100" : "opacity-0",
        )}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        className="relative z-10 max-w-7xl w-full px-8 md:px-12 lg:px-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 relative">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={cn(
                "flex flex-col items-center text-center px-8 md:px-12",
                // Architectural Dividers (Desktops only)
                idx !== items.length - 1 && "md:border-r border-white/10",
              )}
            >
              <h2 className="text-2xl md:text-3xl font-serif text-[#e6b93d] mb-6 tracking-wide text-scrim">
                {item.title}
              </h2>
              <p className="text-sm md:text-base text-white/80 leading-relaxed font-light text-scrim max-w-xs">
                {item.content}
                {item.link && (
                  <>
                    {" "}
                    <a
                      href={item.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-[#e6b93d] font-medium border-b border-[#e6b93d]/30 hover:border-[#e6b93d] transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {item.link.text}
                    </a>
                  </>
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

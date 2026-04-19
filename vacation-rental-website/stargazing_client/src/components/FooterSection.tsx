"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollTellingHooks } from "./scrollytelling/hooks-helper";
import { Globe, Send, MessageCircle, Mail, ArrowUpRight } from "lucide-react";

interface FooterSectionProps {
  start?: number;
  end?: number;
  className?: string;
}

const FOOTER_LINKS = [
  {
    title: "Experience",
    links: [
      { label: "The Retreats", href: "#" },
      { label: "Stargazing Tours", href: "#" },
      { label: "Night Photography", href: "#" },
      { label: "Wellness & Spa", href: "#" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Gallery", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

export default function FooterSection({
  start = 0.82,
  end = 1,
  className,
}: FooterSectionProps) {
  const { active, progress } = useScrollTellingHooks(start, end);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const wordmarkVariants = {
    hidden: { opacity: 0, scale: 1.1, filter: "blur(10px)" },
    visible: {
      opacity: 0.05,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black/60 backdrop-blur-sm transition-all duration-1000",
        active
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
        className,
      )}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        className="relative z-10 w-full max-w-7xl px-8 md:px-16 flex flex-col justify-between h-[50vh]"
      >
        {/* Top Section: Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {FOOTER_LINKS.map((group, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col space-y-6"
            >
              <h3 className="text-[#ffd95f] uppercase tracking-[0.3em] text-xs font-semibold">
                {group.title}
              </h3>
              <ul className="space-y-4">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-[#ffd95f] transition-colors duration-300 flex items-center group text-lg md:text-xl font-serif"
                    >
                      {link.label}
                      <ArrowUpRight className="w-4 h-4 ml-2 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter / Contact Column */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-6"
          >
            <h3 className="text-[#ffd95f] uppercase tracking-[0.3em] text-xs font-semibold">
              The Sentinel
            </h3>
            <p className="text-white/60 text-sm font-serif italic max-w-[200px]">
              Receive our journal on celestial events and exclusive retreats.
            </p>
            <div className="relative flex items-center group">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-transparent border-b border-white/20 py-3 pr-10 w-full text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd95f] transition-colors"
              />
              <button className="absolute right-0 hover:text-[#ffd95f] transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Brand & Socials */}
        <div className="flex flex-col md:flex-row items-end justify-between border-t border-white/10 pt-12">
          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-4 mb-8 md:mb-0"
          >
            <h1 className="text-3xl font-serif text-white tracking-widest uppercase">
              Stargazing
            </h1>
            <p className="text-white/40 text-xs tracking-widest uppercase">
              © 2026 Stargazing Retrearts. All rights reserved.
            </p>
          </motion.div>

          <div className="flex items-center space-x-8">
            <motion.a
              variants={itemVariants}
              href="#"
              className="text-white/60 hover:text-[#ffd95f] transition-all duration-300 hover:scale-110"
            >
              <Globe className="w-6 h-6" />
            </motion.a>
            <motion.a
              variants={itemVariants}
              href="#"
              className="text-white/60 hover:text-[#ffd95f] transition-all duration-300 hover:scale-110"
            >
              <Send className="w-6 h-6" />
            </motion.a>
            <motion.a
              variants={itemVariants}
              href="#"
              className="text-white/60 hover:text-[#ffd95f] transition-all duration-300 hover:scale-110"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.a>
            <motion.a
              variants={itemVariants}
              href="#"
              className="text-white/60 hover:text-[#ffd95f] transition-all duration-300 hover:scale-110"
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}

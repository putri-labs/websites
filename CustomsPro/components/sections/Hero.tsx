// components/sections/Hero.tsx
"use client"

import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden bg-[#fafafa] min-h-[90vh] flex flex-col justify-center border-b border-gray-100">
      {/* Light mode soft background gradients */}
      <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[40rem] opacity-60 pointer-events-none mix-blend-multiply" 
           style={{ background: 'radial-gradient(ellipse at top, rgba(79,70,229,0.15) 0%, rgba(250,250,250,0) 70%)' }}>
      </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] opacity-40 pointer-events-none mix-blend-multiply" 
           style={{ background: 'radial-gradient(circle at center, rgba(168,85,247,0.1) 0%, rgba(250,250,250,0) 60%)' }}>
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-gray-700 text-xs font-semibold mb-8 border border-gray-200 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] animate-pulse" />
          AI-Powered Customs Filing
          <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8 text-gray-900 drop-shadow-sm uppercase"
        >
          File Bills of Entry{" "}
          <br className="hidden sm:block" />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
            in Minutes,
            <span className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full opacity-50 blur-sm"></span>
          </span>{" "}
          <span className="text-gray-300 stroke-text">Not Hours</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-bold"
        >
          CustomsPro gives Customs House Agents an AI-powered workflow — from
          document upload to ICEGATE-ready flat file — securely and instantly.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Uiverse.io 3D Button style */}
          <a href="#contact" className="group relative w-full sm:w-auto">
            <div className="absolute inset-0 bg-indigo-600 rounded-2xl transform translate-y-2 group-hover:translate-y-1 transition duration-200"></div>
            <div className="absolute inset-0 bg-indigo-800 rounded-2xl"></div>
            <div className="relative flex items-center justify-center gap-2 bg-indigo-500 text-white font-bold text-lg px-10 py-5 rounded-2xl border-2 border-indigo-400 transform -translate-y-2 group-hover:-translate-y-1 group-active:translate-y-0 transition duration-200 shadow-xl">
              Get Started
              <svg className="w-5 h-5 ml-1 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>

          {/* Uiverse.io outline dashed shiny button */}
          <a href="#demo" className="group relative w-full sm:w-auto overflow-hidden rounded-2xl p-[2px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-white px-10 py-5 text-lg font-bold text-gray-900 transition-colors group-hover:bg-gray-50 border border-gray-100 gap-2">
              View Demo
            </span>
          </a>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-20 relative mx-auto max-w-5xl group perspective-[1000px]"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
          
          {/* 3D Tilted Card UIverse style */}
          <div className="relative rounded-[2.5rem] border border-gray-200/50 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden aspect-video flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-x-[2deg] group-hover:-translate-y-2 group-hover:shadow-[0_45px_70px_rgba(0,0,0,0.15)]">
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-multiply"></div>
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
            
            <div className="flex flex-col items-center gap-6 z-10">
              {/* 3D Isometric Drop Folder Icon */}
              <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-2xl">
                {/* Back flap */}
                <polygon points="20,40 80,40 70,20 30,20" fill="#a5b4fc" />
                {/* Inside */}
                <polygon points="20,40 20,80 80,80 80,40" fill="#818cf8" />
                {/* File */}
                <polygon points="35,30 65,30 65,70 35,70" fill="#ffffff" />
                <rect x="40" y="40" width="20" height="2" fill="#c7d2fe" />
                <rect x="40" y="45" width="20" height="2" fill="#c7d2fe" />
                <rect x="40" y="50" width="15" height="2" fill="#c7d2fe" />
                {/* Front flap */}
                <polygon points="10,50 90,50 80,85 20,85" fill="#6366f1" />
              </svg>
              <p className="text-indigo-900 text-lg font-bold tracking-wide">Drop commercial invoice here</p>
            </div>
            
            {/* Window dots */}
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="w-4 h-4 rounded-full bg-rose-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
              <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
              <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]"></div>
            </div>
          </div>
        </motion.div>

        <motion.p variants={fadeInUp} className="mt-12 text-sm text-gray-500 font-bold tracking-wider uppercase flex items-center justify-center gap-4">
          Trusted by top CHA firms
          <span className="w-12 h-1 bg-gradient-to-r from-gray-200 to-transparent rounded-full"></span>
        </motion.p>
      </motion.div>
    </section>
  )
}

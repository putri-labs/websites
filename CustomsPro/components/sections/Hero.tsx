// components/sections/Hero.tsx
"use client"

import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"

export function Hero() {
  return (
    <section className="relative pt-32 pb-32 px-4 sm:px-6 overflow-hidden bg-[#FAFAFA] min-h-[95vh] flex flex-col justify-center">
      {/* Background animated blobs for glassmorphism effect */}
      <div className="absolute top-0 left-1/2 -ml-[30rem] w-[60rem] h-[60rem] opacity-40 pointer-events-none mix-blend-multiply blur-3xl rounded-full" 
           style={{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.4) 0%, rgba(250,250,250,0) 70%)' }}>
      </div>
      <div className="absolute -top-32 right-0 w-[50rem] h-[50rem] opacity-40 pointer-events-none mix-blend-multiply blur-3xl rounded-full" 
           style={{ background: 'radial-gradient(circle at center, rgba(236,72,153,0.3) 0%, rgba(250,250,250,0) 70%)' }}>
      </div>
      <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] opacity-30 pointer-events-none mix-blend-multiply blur-3xl rounded-full" 
           style={{ background: 'radial-gradient(circle at center, rgba(168,85,247,0.4) 0%, rgba(250,250,250,0) 70%)' }}>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Left column - Text Content */}
        <div className="text-left space-y-8">
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-indigo-900 text-sm font-semibold shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-saturate-150"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
            Next-Gen Customs Filing AI
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900"
          >
            Clear Customs{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-sm pb-2">
              Instantly
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 leading-relaxed max-w-xl font-medium"
          >
            Automate your Bills of Entry with our stunning AI platform. Transform documents into ICEGATE-ready files in seconds, encased in a beautiful, lightning-fast experience.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <a href="#get-started" className="w-full sm:w-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-[0_8px_30px_rgba(79,70,229,0.3)]">
                Start Filing Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
            
            <a href="#demo" className="w-full sm:w-auto relative group flex items-center justify-center gap-2 text-lg font-semibold text-gray-700 px-8 py-4 rounded-2xl bg-white/50 backdrop-blur-lg border border-white/60 hover:bg-white/80 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              Watch Demo
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="pt-8 flex items-center gap-4 text-sm text-gray-500 font-semibold">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#FAFAFA] bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 shadow-sm z-30">C</div>
              <div className="w-10 h-10 rounded-full border-2 border-[#FAFAFA] bg-purple-100 flex items-center justify-center font-bold text-purple-700 shadow-sm z-20">F</div>
              <div className="w-10 h-10 rounded-full border-2 border-[#FAFAFA] bg-pink-100 flex items-center justify-center font-bold text-pink-700 shadow-sm z-10">I</div>
            </div>
            Trusted by 500+ top compliance agents
          </motion.div>
        </div>

        {/* Right column - 3D Glassmorphism Animation */}
        <div className="relative h-[600px] w-full hidden md:block" style={{ perspective: 1200 }}>
          {/* Main Glass Card container */}
          <motion.div
             className="absolute inset-x-4 inset-y-12 sm:inset-x-8 rounded-[2.5rem] bg-white/30 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_rgba(31,38,135,0.07)] p-6 sm:p-8 flex flex-col backdrop-saturate-150"
             animate={{ 
               rotateX: [15, 20, 15], 
               rotateY: [-15, -20, -15],
               y: [-10, 10, -10]
             }}
             transition={{
               duration: 6,
               repeat: Infinity,
               ease: "easeInOut"
             }}
             style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Top Bar of UI */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/40" style={{ transform: "translateZ(20px)" }}>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="h-4 w-32 bg-white/50 rounded-full"></div>
            </div>
            
            <div className="flex-1 flex gap-6 relative">
               {/* Left Sidebar Skeleton */}
               <div className="w-1/3 min-w-[120px] bg-white/40 rounded-2xl p-4 flex flex-col gap-3 border border-white/50 shadow-[0_8px_16px_rgba(0,0,0,0.03)]" style={{ transform: "translateZ(30px)" }}>
                  <div className="h-3 w-3/4 bg-gray-200/60 rounded-full mb-4"></div>
                  <div className="h-8 w-full bg-indigo-500/10 rounded-xl"></div>
                  <div className="h-8 w-full bg-white/60 rounded-xl"></div>
                  <div className="h-8 w-full bg-white/60 rounded-xl"></div>
                  <div className="h-8 w-full bg-white/60 rounded-xl mt-auto"></div>
               </div>
               
               {/* Main Content Area */}
               <div className="flex-1 flex flex-col gap-4" style={{ transform: "translateZ(40px)" }}>
                  {/* Glowing Floating Metric Card */}
                  <div className="h-28 w-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-[0_16px_32px_rgba(99,102,241,0.3)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full mix-blend-overlay blur-xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-pink-500/30 rounded-full mix-blend-overlay blur-lg"></div>
                    <div className="text-indigo-100 text-sm font-medium mb-1 drop-shadow-sm">Extraction Accuracy</div>
                    <div className="text-4xl font-extrabold tracking-tight">99.8%</div>
                  </div>
                  
                  {/* Data Rows */}
                  <div className="flex-1 bg-white/60 rounded-2xl border border-white/80 p-5 shadow-sm flex flex-col gap-4 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-pink-100 flex-shrink-0 shadow-inner"></div>
                       <div className="flex-1 space-y-2">
                         <div className="h-3 bg-gray-200/80 rounded-full w-full"></div>
                         <div className="h-3 bg-gray-200/60 rounded-full w-2/3"></div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-purple-100 flex-shrink-0 shadow-inner"></div>
                       <div className="flex-1 space-y-2">
                         <div className="h-3 bg-gray-200/80 rounded-full w-11/12"></div>
                         <div className="h-3 bg-gray-200/60 rounded-full w-1/2"></div>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 hidden lg:flex">
                       <div className="w-10 h-10 rounded-xl bg-indigo-100 flex-shrink-0 shadow-inner"></div>
                       <div className="flex-1 space-y-2">
                         <div className="h-3 bg-gray-200/80 rounded-full w-4/5"></div>
                         <div className="h-3 bg-gray-200/60 rounded-full w-3/4"></div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Floating 3D Element outside the main card */}
            <motion.div
               className="absolute -right-4 -bottom-8 lg:-right-12 lg:-bottom-12 w-32 h-32 lg:w-40 lg:h-40 bg-white/40 backdrop-blur-2xl border border-white/70 rounded-[2rem] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex items-center justify-center backdrop-saturate-150"
               animate={{ 
                 rotateZ: [0, 5, 0],
                 y: [0, -15, 0]
               }}
               transition={{
                 duration: 4,
                 repeat: Infinity,
                 ease: "easeInOut",
                 delay: 1.5
               }}
               style={{ transform: "translateZ(80px)", transformStyle: 'preserve-3d' }}
            >
              <div className="w-full h-full bg-gradient-to-br from-white to-pink-50/50 rounded-2xl border border-white/80 flex flex-col items-center justify-center gap-3 shadow-inner" style={{ transform: "translateZ(20px)" }}>
                 <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <span className="text-gray-800 font-bold text-sm tracking-tight">ICEGATE Ready</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

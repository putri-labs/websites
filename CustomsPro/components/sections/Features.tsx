// components/sections/Features.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"

const features = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-lg scale-100 group-hover:scale-110 transition-transform duration-300">
        {/* Document */}
        <polygon points="40,15 70,30 70,50 40,35" fill="#ffffff" />
        <polygon points="38,16 40,15 40,35 38,36" fill="#e5e7eb" />
        <polygon points="38,36 40,35 70,50 68,51" fill="#d1d5db" />
        {/* Scanner Base Left */}
        <polygon points="20,40 50,55 50,75 20,60" fill="#6366f1" />
        {/* Scanner Base Right */}
        <polygon points="50,55 80,40 80,60 50,75" fill="#4f46e5" />
        {/* Scanner Top */}
        <polygon points="20,40 50,25 80,40 50,55" fill="#818cf8" />
        <circle cx="50" cy="40" r="4" fill="#a5b4fc" />
      </svg>
    ),
    title: "AI Document Extraction",
    description: "Upload any shipping document — Claude AI reads and autofills BE fields with >85% accuracy, eliminating manual data entry.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-lg scale-100 group-hover:scale-110 transition-transform duration-300">
        {/* Stack of Coins */}
        <ellipse cx="50" cy="50" rx="20" ry="10" fill="#fcd34d" />
        <path d="M30,50 v10 a20,10 0 0,0 40,0 v-10 z" fill="#f59e0b" />
        <ellipse cx="50" cy="40" rx="20" ry="10" fill="#fbbf24" />
        <path d="M30,40 v10 a20,10 0 0,0 40,0 v-10 z" fill="#d97706" />
        <ellipse cx="50" cy="30" rx="20" ry="10" fill="#fde68a" />
        <path d="M30,30 v10 a20,10 0 0,0 40,0 v-10 z" fill="#fbbf24" />
      </svg>
    ),
    title: "Auto Duty Calculation",
    description: "BCD, IGST, Health Cess, and other duties calculated automatically from CTH codes. Override any value as needed.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-lg scale-100 group-hover:scale-110 transition-transform duration-300">
        {/* Block 1 */}
        <polygon points="30,40 50,30 70,40 50,50" fill="#93c5fd" />
        <polygon points="30,40 50,50 50,60 30,50" fill="#3b82f6" />
        <polygon points="70,40 50,50 50,60 70,50" fill="#2563eb" />
        {/* Block 2 */}
        <polygon points="30,60 50,50 70,60 50,70" fill="#60a5fa" />
        <polygon points="30,60 50,70 50,80 30,70" fill="#2563eb" />
        <polygon points="70,60 50,70 50,80 70,70" fill="#1d4ed8" />
      </svg>
    ),
    title: "ICEGATE Flat File Generation",
    description: "Generate 100% schema-compliant flat files for ICEGATE submission at the click of a button. No formatting errors.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-lg scale-100 group-hover:scale-110 transition-transform duration-300">
        <circle cx="35" cy="40" r="10" fill="#34d399" />
        <path d="M15,70 Q35,45 55,70 Z" fill="#10b981" />
        <circle cx="65" cy="30" r="10" fill="#a7f3d0" />
        <path d="M45,60 Q65,35 85,60 Z" fill="#059669" />
      </svg>
    ),
    title: "Multi-Firm, Multi-User",
    description: "Full multi-tenancy from day one — multiple CHA firms, each with isolated data and their own team members.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-lg scale-100 group-hover:scale-110 transition-transform duration-300">
        <polygon points="10,70 50,50 90,70 50,90" fill="#f3f4f6" />
        <polygon points="10,70 50,90 50,100 10,80" fill="#d1d5db" />
        <polygon points="90,70 50,90 50,100 90,80" fill="#9ca3af" />
        
        <polygon points="20,60 35,52 35,30 20,38" fill="#f43f5e" />
        <polygon points="35,52 50,60 50,38 35,30" fill="#e11d48" />
        <polygon points="20,38 35,30 50,38 35,46" fill="#fb7185" />
        
        <polygon points="50,75 65,67 65,20 50,28" fill="#ec4899" />
        <polygon points="65,67 80,75 80,28 65,20" fill="#db2777" />
        <polygon points="50,28 65,20 80,28 65,36" fill="#f472b6" />
      </svg>
    ),
    title: "Real-time Job Dashboard",
    description: "Track every BE from Draft to Submitted to Cleared. Full visibility into your team workload and job status.",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-lg scale-100 group-hover:scale-110 transition-transform duration-300">
        {/* Box */}
        <polygon points="20,40 50,25 80,40 50,55" fill="#7dd3fc" />
        <polygon points="20,40 50,55 50,80 20,65" fill="#0284c7" />
        <polygon points="80,40 50,55 50,80 80,65" fill="#0369a1" />
        {/* Checkmark 3D */}
        <polygon points="35,45 45,55 65,35 60,30 45,45 40,40" fill="#ffffff" />
        <polygon points="35,48 45,58 65,38 65,35 45,55 35,45" fill="#bae6fd" />
      </svg>
    ),
    title: "Draft Save and Resume",
    description: "Save your progress at any point and resume exactly where you left off. No data lost, no work duplicated.",
  },
]

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="p-8 rounded-[2rem] border border-gray-200 bg-white hover:border-indigo-100 hover:shadow-[0_10px_40px_rgba(79,70,229,0.1)] shadow-sm transition-all duration-300 group relative overflow-hidden"
    >
      {/* UIverse Animated Line effect running around the border */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 right-[100%] w-[200%] h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent group-hover:animate-[ui-run_2s_linear_infinite]" />
         <div className="absolute top-[-100%] right-0 w-1 h-[200%] bg-gradient-to-b from-transparent via-purple-400 to-transparent group-hover:animate-[ui-run-vertical_2s_linear_infinite_0.5s]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="mb-6 group-hover:scale-110 transition-transform duration-500 origin-center sm:origin-left">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
      </div>
    </motion.div>
  )
}

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="features" className="py-32 px-4 sm:px-6 bg-white relative border-t border-gray-100">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={fadeInUp} className="text-center mb-24">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tighter">Everything a CHA firm needs</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              CustomsPro replaces legacy desktop software with a modern, AI-powered web platform built specifically for Indian customs filing.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
